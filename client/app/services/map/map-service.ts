import { Injectable } from 'angular2/core';


@Injectable()
  export class GoogleMapService {
    finalDist: any;
    map = null;
    
    constructor(){}
    
    calcDistance(previousPlaces){
      let coordArray = [];
      let distArray = [];
      for (let i = 0; i < previousPlaces.length; i++) {
        coordArray.push(new google.maps.LatLng(previousPlaces[i].location.coordinate.latitude, previousPlaces[i].location.coordinate.longitude));
      }
      for (let j = 0; j < coordArray.length -1; j++) {
        distArray.push(google.maps.geometry.spherical.computeDistanceBetween(coordArray[j], coordArray[j+1]));
      }
      let sum = distArray.reduce((previousValue, currentValue) => {
        return previousValue + currentValue 
      });
      this.finalDist = (sum * 0.000621371).toPrecision(3);
      return this.finalDist;
    }

    loadMap(lat, long, zoom, content){
      let loadMapPromise = new Promise((resolve, reject) => {
        let options = { timeout: 10000, enableHighAccuracy: true };
        let latLng = new google.maps.LatLng(lat, long);
        let mapOptions = {
          center: latLng,
          zoom: zoom,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
        if (content !== null) {
          this.addMarker(latLng, content, this.map);
        }
        resolve(this.map);
      });
      return loadMapPromise;
    }

    addMarker(coords, content, map) {
      let pin = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: coords
      });

      let info = content;
      this.addInfoWindow(pin, info);
    }

    addInfoWindow(marker, content){
      console.log(content);
      let infoWindow = new google.maps.InfoWindow({
        content: content
      });

      google.maps.event.addListener(marker, 'click', function(){
        infoWindow.open(this.map, marker);
      });
    }
    
    finalMapMaker(previousPlaces, previousTasks) {
      let finalMapMakerPromise = new Promise((resolve, reject) => {
        let finalLat = parseFloat(previousPlaces[previousPlaces.length - 1].location.coordinate.latitude);
        let finalLng = parseFloat(previousPlaces[previousPlaces.length - 1].location.coordinate.longitude);
        this.loadMap(finalLat, finalLng, 12, null)
          .then(map => {
            let bounds = new google.maps.LatLngBounds();
            let points = [];
            for (let i = 0; i < previousPlaces.length; i++) {
              console.log(' this is i ', i);
              let currLat = previousPlaces[i].location.coordinate.latitude;
              let currLng = previousPlaces[i].location.coordinate.longitude;
              let name = previousPlaces[i].name;
              let currChallenge = previousTasks[i].content;
              let currPos = new google.maps.LatLng(currLat, currLng);
              let info = '<h4>' + currChallenge + '</h4><p>' + name  + '</p>';
              points.push(new google.maps.LatLng(currLat, currLng));
              this.addMarker(currPos, info, this.map);
              bounds.extend(currPos);
              this.map.fitBounds(bounds);
            }
            let flightPath = new google.maps.Polyline({
              map: this.map,
              path: points,
              strokeColor: "#FF0000",
              strokeOpacity: 1.0,
              strokeWeight: 2
            });
            resolve(flightPath); 
          });
      });
      return finalMapMakerPromise;
    }
  }