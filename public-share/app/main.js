/// <reference path="../node_modules/angular2/typings/browser.d.ts" />
/// <reference path="../typings/main/ambient/underscore/index.d.ts" />
/// <reference path="../typings/main/ambient/google.maps/index.d.ts" />
/// <reference path="../typings/main/ambient/node/index.d.ts" />
/// <reference path="../typings/main/ambient/socket.io/index.d.ts" />
/// <reference path="../typings/main/ambient/moment-node/index.d.ts" />
/// <reference path="../typings/main/ambient/moment/index.d.ts" />
"use strict";
var browser_1 = require('angular2/platform/browser');
var app_component_1 = require('./app.component');
var core_1 = require('angular2/core');
var router_1 = require('angular2/router');
require('rxjs/Rx');
var core_2 = require('angular2/core');
core_2.enableProdMode();
browser_1.bootstrap(app_component_1.AppComponent, [[
        router_1.ROUTER_PROVIDERS,
        core_1.provide(router_1.LocationStrategy, { useClass: router_1.HashLocationStrategy })
    ]]);
//# sourceMappingURL=main.js.map