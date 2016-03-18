import {App, IonicApp, Platform, MenuController} from 'ionic-angular';
import {Http} from 'angular2/http';
import {provide} from 'angular2/core';
import {AuthHttp, AuthConfig} from 'angular2-jwt';
import {AuthService} from './services/auth/auth-service';
import {LogIn} from './pages/users/log-in';
import {TemplatePage} from './pages/templates/templates';
import {TaskPage} from './pages/tasks/tasks';

import * as _ from 'underscore';

@App({
  templateUrl: 'build/app.html',
  config: {}, // http://ionicframework.com/docs/v2/api/config/Config/
  providers: [
    provide(AuthHttp, {
      useFactory: (http) => {
        return new AuthHttp(new AuthConfig, http);
      },
      deps: [Http]
    })
  ]
})
class MyApp {
  // make HelloIonicPage the root (or first) page
  rootPage: any = LogIn;
  pages: Array<{title: string, component: any}>;
  auth: AuthService;
  logout: LogIn;
  constructor(
    private app: IonicApp,
    private platform: Platform,
    private menu: MenuController
  ) {
    this.initializeApp();

    this.auth = AuthService

    this.setPages()
    //set our app's pages
    // this.pages = [
    //   { title: 'Log In', component: LogIn },
    //   { title: 'Hunts', component: TemplatePage },
    //   { title: 'Current Task', component: TaskPage },
    //   { title: 'Log Out', component: LogIn}
    // ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // The platform is now ready. Note: if this callback fails to fire, follow
      // the Troubleshooting guide for a number of possible solutions:
      //
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //
      // First, let's hide the keyboard accessory bar (only works natively) since
      // that's a better default:
      //
      // Keyboard.setAccessoryBarVisible(false);
      //
      // For example, we might change the StatusBar color. This one below is
      // good for dark backgrounds and light text:
      // StatusBar.setStyle(StatusBar.LIGHT_CONTENT)
    });
  }

  setPages(){
    // if(this.auth.authenticated()){
    //   this.pages = [
    //   { title: 'Hunts', component: TemplatePage },
    //   { title: 'Current Task', component: TaskPage },
    //   { title: 'Log Out', component: LogIn}
    //   ];
    // }
    // else {[
    //   { title: 'Log In', component: LogIn }
    // ]}
          this.pages = [
      { title: 'Hunts', component: TemplatePage },
      { title: 'Current Task', component: TaskPage },
      { title: 'Log Out', component: LogIn}
      ];
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    if(page.title === 'Log Out'){
      localStorage.removeItem('id_token'); 
    }
    // navigate to the new page if it is not the current page
    let nav = this.app.getComponent('nav');
    nav.setRoot(page.component);
  }
}
