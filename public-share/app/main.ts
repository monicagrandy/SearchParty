import {bootstrap} from 'angular2/platform/browser';
import {AppComponent} from './app.component';
import {provide} from 'angular2/core';
import {ROUTER_PROVIDERS, APP_BASE_HREF, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {enableProdMode} from 'angular2/core';

enableProdMode();

bootstrap(AppComponent, [[
  ROUTER_PROVIDERS, // includes binding to PathLocationStrategy
  provide(LocationStrategy, {useClass: HashLocationStrategy})
]]);