import {Storage, LocalStorage} from 'ionic-angular';
import {AuthHttp, JwtHelper, tokenNotExpired} from 'angular2-jwt';
import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';


@Injectable()
export class AuthService {
  jwtHelper: JwtHelper = new JwtHelper();
  lock: Auth0Lock = new Auth0Lock('bpi5YrRAcuUIvWf87o5fQUjVtql1rswp', 'englishmuffinllc.auth0.com');
  local: Storage = new Storage(LocalStorage);
  refreshSubscription: any;
  user: Object;

  constructor(private authHttp: AuthHttp) {
    let profile = this.local.get('profile')._result;
    if (profile) {
      this.user = JSON.parse(profile);
    }
  }

  public authenticated() {
    return tokenNotExpired();
  }

  public login() {
    this.lock.show({
      authParams: {
        scope: 'openid offline_access',
        device: 'Mobile device'
      }
    }, (err, profile, token, accessToken, state, refreshToken) => {
      if (err) {
        alert(err);
      }

      this.local.set('profile', JSON.stringify(profile));
      this.local.set('id_token', profile.token);
      this.local.set('refresh_token', refreshToken);
      this.user = profile;
      this.scheduleRefresh();
    });
  }

  public logout() {
    this.local.remove('profile');
    this.local.remove('id_token');
    this.local.remove('refresh_token');
    this.user = null;
    this.unscheduleRefresh();
  }

  public scheduleRefresh() {
    let source = this.authHttp.tokenStream.flatMap(
      token => {
        let jwtIat = this.jwtHelper.decodeToken(token).iat;
        let jwtExp = this.jwtHelper.decodeToken(token).exp;
        let iat = new Date(0);
        let exp = new Date(0);

        let delay = (exp.setUTCSeconds(jwtExp) - iat.setUTCSeconds(jwtIat));

        return Observable.interval(delay);
      });

    this.refreshSubscription = source.subscribe(() => {
      this.getNewJwt();
    });
  }

  public startupTokenRefresh() {
    if (this.authenticated()) {
      let source = this.authHttp.tokenStream.flatMap(
        token => {
          let now: number = new Date().valueOf();
          let jwtExp: number = this.jwtHelper.decodeToken(token).exp;
          let exp: Date = new Date(0);
          exp.setUTCSeconds(jwtExp);
          let delay: number = exp.valueOf() - now;
          return Observable.timer(delay);
        });
        source.subscribe(() => {
          this.getNewJwt();
          this.scheduleRefresh();
        });
      }
    }

    public unscheduleRefresh() {
      if (this.refreshSubscription) {
        this.refreshSubscription.unsubscribe();
      }
    }

    public getNewJwt() {
      let refreshToken = this.local.get('refresh_token')._result;
      this.lock.getClient().refreshToken(refreshToken, (err, delegationRequest) => {
        if (err) {
          alert(err);
        }
        this.local.set('id_token', delegationRequest.id_token);
      });
    }
}
