"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var router_1 = require('angular2/router');
var all_1 = require('ng2-material/all');
var map_service_1 = require('./map-service');
var MapComponent = (function () {
    function MapComponent(_params, _googleMaps) {
        this._params = _params;
        this._googleMaps = _googleMaps;
        this.map = null;
    }
    MapComponent = __decorate([
        core_1.Component({
            selector: 'my-map',
            templateUrl: './share/app/map/map.component.html',
            styleUrls: ['./share/app/map/map.component.css'],
            directives: [router_1.ROUTER_DIRECTIVES, all_1.MATERIAL_DIRECTIVES],
            providers: [all_1.MATERIAL_PROVIDERS, map_service_1.GoogleMapService]
        }), 
        __metadata('design:paramtypes', [router_1.RouteParams, map_service_1.GoogleMapService])
    ], MapComponent);
    return MapComponent;
}());
exports.MapComponent = MapComponent;
//# sourceMappingURL=map.component.js.map