//import {Page} from 'ionic-angular';
import {Page, Storage, LocalStorage, NavController, NavParams} from 'ionic-angular';
import {TemplatePage} from '../templates/templates';
import {Http, Headers} from 'angular2/http';
import {FORM_DIRECTIVES} from 'angular2/common';
import {JwtHelper} from 'angular2-jwt';
import {AuthService} from '../../services/auth/auth-service';
import 'rxjs/add/operator/map';

@Page({
  templateUrl: 'build/pages/users/log-in.html',
  directives: [FORM_DIRECTIVES]
})

export class LogIn {
LOGIN_URL: string = "http://localhost:8000/signin"; //update this later
SIGNUP_URL: string = "http://localhost:8000/signup";
userLat: any;
userLng: any;
  auth: AuthService;
  // When the page loads, we want the Login segment to be selected
  authType: string = 'login';
  // We need to set the content type for the server
  contentHeader: Headers = new Headers({'Content-Type': 'application/json'});
  error: string;
  jwtHelper: JwtHelper = new JwtHelper();
  local: Storage = new Storage(LocalStorage);
  user: string;

  constructor(private http: Http, private nav: NavController, navParams: NavParams) {
    this.auth = AuthService;
    let token = this.local.get('id_token')._result;
    if(token) {
      this.user = this.jwtHelper.decodeToken(token).username;
    }
  }

  login(credentials) {
    console.log(credentials);
    navigator.geolocation.getCurrentPosition(position => {
      this.local.set('userLat', position.coords.latitude)
      this.local.set('userLng', position.coords.longitude)
      this.http.post(this.LOGIN_URL, JSON.stringify(credentials), { headers: this.contentHeader })
        .map(res => res.json())
        .subscribe(
          data => {
            if(data) {
              console.log(data);
            }
            this.authSuccess(data.token);
                  this.nav.push(TemplatePage)
                  console.log(data.token)
                },
          err => {
            this.error = err;
            console.log(this.error);
          }
        );
    })
  }

  signup(credentials) {
    navigator.geolocation.getCurrentPosition(position => {
      console.log(credentials)
      this.local.set('userLat', position.coords.latitude)
      this.local.set('userLng', position.coords.longitude)
      this.userLng = position.coords.longitude
      this.http.post(this.SIGNUP_URL, JSON.stringify(credentials), { headers: this.contentHeader })
        .map(res => res.json())
        .subscribe(
          data => {
                   console.log(data.token);
                   this.authSuccess(data.token);
                   this.nav.push(TemplatePage);
                 },
          err => this.error = err
        );
      })
    }

  logout() {
    this.local.remove('id_token');
    this.user = null;
  }

  authSuccess(token) {
    this.error = null;
    this.local.set('id_token', token);
    this.user = this.jwtHelper.decodeToken(token).username;
    console.log(this.user);
  }

  loadTemplates() {
    this.nav.push(TemplatePage)
  }

}
