System.register(['angular2/core', './searchparty-service', './map-service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, searchparty_service_1, map_service_1;
    var SocketService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (searchparty_service_1_1) {
                searchparty_service_1 = searchparty_service_1_1;
            },
            function (map_service_1_1) {
                map_service_1 = map_service_1_1;
            }],
        execute: function() {
            SocketService = (function () {
                function SocketService(_searchPartyService, _googleMaps) {
                    this._searchPartyService = _searchPartyService;
                    this._googleMaps = _googleMaps;
                    this.SOCKET_URL = localStorage.socket || 'https://getsearchparty.com';
                }
                SocketService.prototype.createSocket = function (huntID) {
                    var _this = this;
                    this.socket = io.connect(this.SOCKET_URL);
                    this.huntID = huntID;
                    this.socket.on("connect", function () {
                        _this.socket.emit('huntMapRoom', _this.huntID);
                    });
                    this.updateTask();
                    this.updateLocation();
                };
                SocketService.prototype.updateTask = function () {
                    var _this = this;
                    this.socket.on('taskChange', function (location, task, room, lat, lng, num) {
                        console.log(' this is the task change location change ', location);
                        _this.socket.emit('chat_message', '::TASK HAS CHANGED::', 'SearchPartyAdmin', null, _this.huntID);
                        _this.socket.emit('chat_message', 'challenge completed!', 'Party Bot', Date.now() / 1000, _this.huntID);
                        console.log('task change socket is calling the searchParty Service to update the feed!');
                        _this._searchPartyService.getHunt(_this.huntID);
                    });
                };
                SocketService.prototype.updateLocation = function () {
                    var _this = this;
                    this.socket.on("location", function (data, username) {
                        var coords = new google.maps.LatLng(data.latitude, data.longitude);
                        setTimeout(function () { return _this._googleMaps.addCurrentMarker(coords, username + "'s location")
                            .then(function (map) { return ("map updated with " + username + "'s location!"); }); }, 2000);
                        console.log('location was updated from socket server ', data, username);
                    });
                };
                SocketService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [searchparty_service_1.SearchPartyService, map_service_1.GoogleMapService])
                ], SocketService);
                return SocketService;
            }());
            exports_1("SocketService", SocketService);
        }
    }
});
//# sourceMappingURL=socket-service.js.map