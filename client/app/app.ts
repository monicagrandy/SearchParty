import {App, IonicApp, Storage, LocalStorage, Platform, MenuController} from 'ionic-angular';
import {Http} from 'angular2/http';
import {provide} from 'angular2/core';
import {AuthHttp, AuthConfig} from 'angular2-jwt';
import {AuthService} from './services/auth/auth-service';
import {UrlService} from './services/url/url-service';
import {APIService} from './services/api/api-service';
import {GoogleMapService} from './services/map/map-service';
import {LogIn} from './pages/users/log-in';
import {TemplatePage} from './pages/templates/templates';
import {TaskPage} from './pages/tasks/tasks';
import {ProfilePage} from './pages/profile/profile';
import {enableProdMode} from 'angular2/core';

// enableProdMode();

import * as _ from 'underscore';

@App({
  templateUrl: 'build/app.html',
  config: {}, // http://ionicframework.com/docs/v2/api/config/Config/
  providers: [
    provide(AuthHttp, {
      useFactory: http => {
        return new AuthHttp(new AuthConfig, http);
      },
      deps: [Http]
    }),
    UrlService,
    AuthService,
    APIService,
    GoogleMapService
  ]
})
export class MyApp {
  rootPage: any = LogIn;
  pages: Array<{title: string, component: any}>;
  unauthPages: Array<{title: string, component: any}>;
  local: Storage = new Storage(LocalStorage);
  logout: LogIn;
  constructor(
    private app: IonicApp,
    private platform: Platform,
    private menu: MenuController,
    private auth: AuthService,
    private urlService: UrlService
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
      //comment out urlservice for deployment
      // this.urlService.grabUrls()
      //   .then(urls => {
      //     for (let key in urls) {
      //       console.log('this is the key ', key);
      //       this.local.set(key, urls[key]);
      //     }
      //   });

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
      localStorage.clear();
      location.reload();

    }
    // navigate to the new page if it is not the current page
    let nav = this.app.getComponent('nav');
      nav.push(page.component);
  }

}
