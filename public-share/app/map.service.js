System.register(['angular2/core'], function(exports_1, context_1) {
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
    var core_1;
    var GoogleMapService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            GoogleMapService = (function () {
                function GoogleMapService() {
                    this.map = null;
                }
                GoogleMapService.prototype.calcDistance = function (previousPlaces) {
                    var coordArray = [];
                    var distArray = [];
                    for (var i = 0; i < previousPlaces.length; i++) {
                        coordArray.push(new google.maps.LatLng(previousPlaces[i].location.coordinate.latitude, previousPlaces[i].location.coordinate.longitude));
                    }
                    for (var j = 0; j < coordArray.length - 1; j++) {
                        distArray.push(google.maps.geometry.spherical.computeDistanceBetween(coordArray[j], coordArray[j + 1]));
                    }
                    var sum = distArray.reduce(function (previousValue, currentValue) {
                        return previousValue + currentValue;
                    });
                    this.finalDist = (sum * 0.000621371).toPrecision(3);
                    return this.finalDist;
                };
                GoogleMapService.prototype.loadMap = function (lat, long, zoom, content, map) {
                    var _this = this;
                    var loadMapPromise = new Promise(function (resolve, reject) {
                        var options = { timeout: 10000, enableHighAccuracy: true };
                        // console.log('this is the type of lat ', typeof lat);
                        var latLng = new google.maps.LatLng(lat, long);
                        // console.log('this is the latLng ', latLng);
                        var mapOptions = {
                            center: latLng,
                            zoom: zoom,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        };
                        // console.log('this is the map passed in ', map);
                        _this.map = map;
                        _this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
                        // console.log('this is loadMap\'s map ', this.map);
                        if (content !== null) {
                            _this.addMarker(latLng, content, _this.map);
                        }
                        resolve(_this.map);
                    });
                    return loadMapPromise;
                };
                GoogleMapService.prototype.addMarker = function (coords, content, map) {
                    var pin = new google.maps.Marker({
                        map: map,
                        animation: google.maps.Animation.DROP,
                        position: coords
                    });
                    var info = content;
                    this.addInfoWindow(pin, info);
                };
                GoogleMapService.prototype.addInfoWindow = function (marker, content) {
                    console.log(content);
                    var infoWindow = new google.maps.InfoWindow({
                        content: content
                    });
                    google.maps.event.addListener(marker, 'click', function () {
                        infoWindow.open(this.map, marker);
                    });
                };
                GoogleMapService.prototype.finalMapMaker = function (previousPlaces, previousTasks) {
                    var _this = this;
                    var finalMapMakerPromise = new Promise(function (resolve, reject) {
                        // console.log('this is the previousPlaces ', previousPlaces);
                        // console.log('this is the previousTasks ', previousTasks);
                        var finalLat = parseFloat(previousPlaces[previousPlaces.length - 1].location.coordinate.latitude);
                        var finalLng = parseFloat(previousPlaces[previousPlaces.length - 1].location.coordinate.longitude);
                        // console.log('this is the finalLat ', typeof finalLat);
                        // console.log('this is the finalLng ', typeof finalLng);
                        _this.loadMap(finalLat, finalLng, 12, null, _this.map)
                            .then(function (map) {
                            // console.log('this is the map ', map);
                            var bounds = new google.maps.LatLngBounds();
                            var points = [];
                            for (var i = 0; i < previousPlaces.length; i++) {
                                console.log(' this is i ', i);
                                var currLat = previousPlaces[i].location.coordinate.latitude;
                                var currLng = previousPlaces[i].location.coordinate.longitude;
                                var name_1 = previousPlaces[i].name;
                                var currChallenge = previousTasks[i].content;
                                var currPos = new google.maps.LatLng(currLat, currLng);
                                var info = '<h4>' + currChallenge + '</h4><p>' + name_1 + '</p>';
                                points.push(new google.maps.LatLng(currLat, currLng));
                                _this.addMarker(currPos, info, _this.map);
                                // console.log('finished adding marker ', points);
                                bounds.extend(currPos);
                                _this.map.fitBounds(bounds);
                            }
                            // console.log('this is the map ', this.map);
                            var flightPath = new google.maps.Polyline({
                                map: _this.map,
                                path: points,
                                strokeColor: "#FF0000",
                                strokeOpacity: 1.0,
                                strokeWeight: 2
                            });
                            // console.log('this is the flightpath ', flightPath);
                            resolve(flightPath);
                        });
                    });
                    return finalMapMakerPromise;
                };
                GoogleMapService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], GoogleMapService);
                return GoogleMapService;
            }());
            exports_1("GoogleMapService", GoogleMapService);
        }
    }
});
//# sourceMappingURL=map.service.js.map