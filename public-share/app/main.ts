/// <reference path="../node_modules/angular2/typings/browser.d.ts" />
/// <reference path="../typings/main/ambient/underscore/index.d.ts" />
/// <reference path="../typings/main/ambient/google.maps/index.d.ts" />
/// <reference path="../typings/main/ambient/node/index.d.ts" />
/// <reference path="../typings/main/ambient/socket.io/index.d.ts" />
/// <reference path="../typings/main/ambient/moment-node/index.d.ts" />
/// <reference path="../typings/main/ambient/moment/index.d.ts" />

import {bootstrap} from 'angular2/platform/browser';
import {AppComponent} from './app.component';
import {provide} from 'angular2/core';
import {ROUTER_PROVIDERS, APP_BASE_HREF, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import 'rxjs/Rx';
import {enableProdMode} from 'angular2/core';

// g
bootstrap(AppComponent, [[
  ROUTER_PROVIDERS, 
  provide(LocationStrategy, {useClass: HashLocationStrategy})
]]);