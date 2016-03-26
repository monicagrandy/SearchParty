import {App, IonicApp, Platform, MenuController} from 'ionic-angular';
import {Http} from 'angular2/http';
import {provide} from 'angular2/core';
import {AuthHttp, AuthConfig} from 'angular2-jwt';
import {AuthService} from './services/auth/auth-service';
import {LogIn} from './pages/users/log-in';
import {TemplatePage} from './pages/templates/templates';
import {TaskPage} from './pages/tasks/tasks';
import {ProfilePage} from './pages/profile/profile';

import * as _ from 'underscore';

// Avoid name not found warnings
declare var Auth0Lock: any;

@App({
  templateUrl: 'build/app.html',
  config: {}, // http://ionicframework.com/docs/v2/api/config/Config/
  providers: [
    provide(AuthHttp, {
      useFactory: (http) => {
        return new AuthHttp(new AuthConfig, http);
      },
      deps: [Http]
    }),
    AuthService
  ]
})
export class MyApp {
  // make HelloIonicPage the root (or first) page
  rootPage: any = LogIn;
  pages: Array<{title: string, component: any}>;
  unauthPages: Array<{title: string, component: any}>;
  logout: LogIn;
  constructor(
    private app: IonicApp,
    private platform: Platform,
    private menu: MenuController,
    private auth: AuthService
    //private location: Location
  ) {
    this.initializeApp();

    //set our app's pages

    this.pages = [
      { title: 'Hunts', component: TemplatePage },
      { title: 'My Profile', component: ProfilePage },
      { title: 'Log Out', component: LogIn }
    ];

    // unauthenticated pages
    this.unauthPages = [
      { title: 'Log In', component: LogIn }
    ];

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

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    //this.setPages();
    if(page.title === 'Log Out'){
      localStorage.removeItem('id_token');
      localStorage.removeItem('userLat');
      localStorage.removeItem('userLng');
      localStorage.removeItem('startTime');
      localStorage.removeItem('endTime');
      location.reload();

    }
    // navigate to the new page if it is not the current page
    let nav = this.app.getComponent('nav');
      nav.push(page.component);
  }
}
