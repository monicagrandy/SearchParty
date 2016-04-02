//import {Page} from 'ionic-angular';
import {Page, Storage, LocalStorage, NavController, NavParams} from 'ionic-angular';
import {TemplatePage} from '../templates/templates';
import {Http, Headers} from 'angular2/http';
import {JwtHelper} from 'angular2-jwt';
import {AuthService} from '../../services/auth/auth-service';
import {LogInPage} from '../users/log-in';
//import {MyApp} from '../../app'
import 'rxjs/add/operator/map';


@Page ({
  templateUrl: 'build/pages/splash-page/splash-page.html'
})

export class SplashPage {
  constructor(
    private nav: NavController,
  ) {}

  signUpTapped() {
    this.nav.push(LogInPage)
  }
}
