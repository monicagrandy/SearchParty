System.register(['angular2/core', 'angular2/router', 'ng2-material/all', './searchparty-service', './map-service', './chat.component'], function(exports_1, context_1) {
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
    var core_1, router_1, all_1, searchparty_service_1, map_service_1, chat_component_1;
    var MapComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (all_1_1) {
                all_1 = all_1_1;
            },
            function (searchparty_service_1_1) {
                searchparty_service_1 = searchparty_service_1_1;
            },
            function (map_service_1_1) {
                map_service_1 = map_service_1_1;
            },
            function (chat_component_1_1) {
                chat_component_1 = chat_component_1_1;
            }],
        execute: function() {
            MapComponent = (function () {
                function MapComponent(_params, _googleMaps, _searchPartyService) {
                    this._params = _params;
                    this._googleMaps = _googleMaps;
                    this._searchPartyService = _searchPartyService;
                    this.map = null;
                    // this._searchPartyService.getHunt(this.huntID);
                    // let socket = io.connect(this.SOCKET_URL);
                    // this.socket = socket;
                    // this.socket.on("connect", () => {
                    //   this.socket.emit('huntMapRoom', this.huntID);
                    // });
                    // this.socket.on('taskChange', (location, task, room, lat, lng, num) => {
                    //   console.log(' this is the task change location change ', location);
                    //   this.allTasks.unshift([[location], [task]]);
                    //   this.socket.emit('chat_message', '::TASK HAS CHANGED::', 'SearchPartyAdmin', null, this.huntID);
                    //   this.socket.emit('chat_message', 'challenge completed!', 'Party Bot', Date.now()/1000, this.huntID);
                    //   this._searchPartyService.getHunt(this.huntID);
                    // });
                    // this.socket.on("location", (data, username) => {
                    //   let coords = new google.maps.LatLng(data.latitude, data.longitude);
                    //   setTimeout(() => this._googleMaps.addCurrentMarker(coords, 'user location')
                    //     .then(map => this.map = map), 2000);
                    //   console.log('location was updated from socket server ', data, username);
                    // });
                }
                MapComponent = __decorate([
                    core_1.Component({
                        selector: 'my-map',
                        templateUrl: './share/app/map.component.html',
                        styleUrls: ['./share/app/map.component.css'],
                        directives: [router_1.ROUTER_DIRECTIVES, all_1.MATERIAL_DIRECTIVES, chat_component_1.ChatComponent],
                        providers: [all_1.MATERIAL_PROVIDERS, searchparty_service_1.SearchPartyService, map_service_1.GoogleMapService]
                    }), 
                    __metadata('design:paramtypes', [router_1.RouteParams, map_service_1.GoogleMapService, searchparty_service_1.SearchPartyService])
                ], MapComponent);
                return MapComponent;
            }());
            exports_1("MapComponent", MapComponent);
        }
    }
});
//# sourceMappingURL=map.component.js.map