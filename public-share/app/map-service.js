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
var GoogleMapService = (function () {
    function GoogleMapService() {
        this.map = null;
        this.userLocationMarker = null;
        this.userLocationLoadedOnce = 0;
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
            var latLng = new google.maps.LatLng(lat, long);
            var mapOptions = {
                center: latLng,
                zoom: zoom,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            _this.map = map;
            _this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
            if (content !== null) {
                _this.addMarker(latLng, content, _this.map)
                    .then(function (data) {
                    resolve(_this.map);
                });
            }
            resolve(_this.map);
        });
        return loadMapPromise;
    };
    GoogleMapService.prototype.addMarker = function (coords, content, map) {
        var _this = this;
        console.log('this is the content being added ', content);
        var pin = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: coords
        });
        var info = content;
        return this.addInfoWindow(pin, info)
            .then(function (data) {
            return new Promise(function (resolve, reject) {
                resolve(_this.map);
                reject('error in adding marker');
            });
        });
    };
    GoogleMapService.prototype.checkCurrentMarkerIfSame = function (coords) {
        if (this.userLocationLoadedOnce > 1) {
            var pastUserLat = this.userLocationMarker.position.lat();
            var pastUserLng = this.userLocationMarker.position.lng();
            if (pastUserLat === coords.lat() && pastUserLng === coords.lng()) {
                console.log('user coords are the same ');
                return true;
            }
            else {
                console.log('user coords do not match!');
                return false;
            }
        }
        else {
            this.userLocationLoadedOnce++;
        }
    };
    GoogleMapService.prototype.deleteCurrentMarker = function () {
        console.log('deleting current marker');
        this.userLocationMarker.setMap(null);
    };
    GoogleMapService.prototype.addCurrentMarker = function (coords, content) {
        var _this = this;
        var circle = {
            path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
            fillColor: '#5577F6',
            fillOpacity: .6,
            anchor: new google.maps.Point(0, 0),
            strokeColor: 'white',
            strokeWeight: 2,
            scale: 0.5
        };
        if (this.checkCurrentMarkerIfSame(coords)) {
            return new Promise(function (resolve, reject) {
                resolve('not adding a new marker');
            });
        }
        else {
            var pin = new google.maps.Marker({
                map: this.map,
                position: coords,
                icon: circle
            });
            var info = content;
            if (this.userLocationMarker) {
                this.deleteCurrentMarker();
            }
            this.userLocationMarker = pin;
            var currentBounds = this.map.getBounds();
            if (!this.checkIfUserLocationIsInBounds() && this.userLocationLoadedOnce > 1) {
                console.log('user location is not in current bounds! adding it!');
                currentBounds.extend(this.userLocationMarker.position);
                this.map.fitBounds(currentBounds);
            }
            return this.addInfoWindow(pin, info)
                .then(function (data) {
                return new Promise(function (resolve, reject) {
                    resolve(_this.map);
                    reject('error in adding marker');
                });
            });
        }
    };
    GoogleMapService.prototype.checkIfUserLocationIsInBounds = function () {
        if (this.map.getBounds().contains(this.userLocationMarker.position)) {
            return true;
        }
        else {
            return false;
        }
    };
    GoogleMapService.prototype.addInfoWindow = function (marker, content) {
        var _this = this;
        console.log(content);
        var infoWindow = new google.maps.InfoWindow({
            content: content
        });
        return new Promise(function (resolve, reject) {
            google.maps.event.addListener(_this.map, "click", function (event) {
                infoWindow.close();
            });
            resolve(google.maps.event.addListener(marker, 'click', function () {
                infoWindow.open(_this.map, marker);
            }));
            reject('there was an error when adding info window');
        });
    };
    GoogleMapService.prototype.finalMapMaker = function (previousPlaces, previousTasks) {
        var _this = this;
        var finalMapMakerPromise = new Promise(function (resolve, reject) {
            var finalLat = parseFloat(previousPlaces[previousPlaces.length - 1].location.coordinate.latitude);
            var finalLng = parseFloat(previousPlaces[previousPlaces.length - 1].location.coordinate.longitude);
            _this.loadMap(finalLat, finalLng, 12, null, _this.map)
                .then(function (map) {
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
                    bounds.extend(currPos);
                    _this.map.fitBounds(bounds);
                }
                var flightPath = new google.maps.Polyline({
                    map: _this.map,
                    path: points,
                    strokeColor: "#FF0000",
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                });
                // reset userLocation
                _this.userLocationLoadedOnce = 0;
                _this.userLocationMarker = null;
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
exports.GoogleMapService = GoogleMapService;
//# sourceMappingURL=map-service.js.map