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
var api_service_1 = require('./api-service');
var map_service_1 = require('./map-service');
require('rxjs/add/operator/map');
var SearchPartyService = (function () {
    function SearchPartyService(_apiService, _googleMaps) {
        this._apiService = _apiService;
        this._googleMaps = _googleMaps;
        this.huntTasks = [];
        this.allTasks = [];
        this.previousPlaces = [];
        this.previousTasks = [];
        this.taskChange = new core_1.EventEmitter();
        this.totalDistChange = new core_1.EventEmitter();
    }
    SearchPartyService.prototype.getHunt = function (huntID) {
        var _this = this;
        var dataToSend = { huntID: huntID };
        this._apiService.getData(dataToSend, 'singleHunt')
            .then(function (data) {
            _this.updateFeed(data);
        });
    };
    SearchPartyService.prototype.updateFeed = function (data) {
        var _this = this;
        this.allTasks = [];
        this.huntTasks = data.tasks;
        this.content =
            '<h4>' + data.tasks[0].place.name + ' < /h4><p>' +
                data.tasks[0].place.address + '</p > ';
        if (data.chatroom.messages) {
            this.huntChats = data.chatroom.messages;
        }
        this.huntTasks.forEach(function (item) {
            if (item.image) {
                _this.allTasks.unshift([[item.place.name], [item.task.content], [item.image.url]]);
            }
            else {
                _this.allTasks.unshift([[item.place.name], [item.task.content]]);
            }
            _this.previousPlaces.push(item.place);
            _this.previousTasks.push(item.task);
        });
        this.updateMap();
        console.log('this is the huntTasks to be emitted ', this.allTasks);
        this.taskChange.emit(this.allTasks);
    };
    SearchPartyService.prototype.updateMap = function () {
        var _this = this;
        setTimeout(function () {
            _this._googleMaps.finalMapMaker(_this.previousPlaces, _this.previousTasks)
                .then(function (data) {
                var flightPath = data;
            });
            if (_this.previousPlaces.length > 1) {
                _this.totalDist = _this._googleMaps.calcDistance(_this.previousPlaces);
                console.log('total dist to be emitted ', _this.totalDist);
                _this.totalDistChange.emit(_this.totalDist);
            }
        }, 2000);
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], SearchPartyService.prototype, "taskChange", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], SearchPartyService.prototype, "totalDistChange", void 0);
    SearchPartyService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [api_service_1.APIService, map_service_1.GoogleMapService])
    ], SearchPartyService);
    return SearchPartyService;
}());
exports.SearchPartyService = SearchPartyService;
//# sourceMappingURL=searchparty-service.js.map