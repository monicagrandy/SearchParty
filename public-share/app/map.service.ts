import { Injectable } from 'angular2/core';


@Injectable()
  export class GoogleMapService {
    finalDist: any;
    map = null;
    userLocationMarker = null;
    userLocationLoadedOnce = 0;
        
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

    loadMap(lat, long, zoom, content, map){
      let loadMapPromise = new Promise((resolve, reject) => {
        let options = { timeout: 10000, enableHighAccuracy: true };
        let latLng = new google.maps.LatLng(lat, long);
        let mapOptions = {
          center: latLng,
          zoom: zoom,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        this.map = map;
        this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
        if (content !== null) {
          this.addMarker(latLng, content, this.map)
            .then(data => {
              resolve(this.map);
            })
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
      
      return this.addInfoWindow(pin, info)
        .then(data => {
          return new Promise((resolve, reject) => {
            resolve(this.map);
            reject('error in adding marker');
          });
        });
    }
    
    checkCurrentMarkerIfSame(coords) {
      if (this.userLocationLoadedOnce > 1) {
        let pastUserLat = this.userLocationMarker.position.lat();
        let pastUserLng = this.userLocationMarker.position.lng();
        if (pastUserLat === coords.lat() && pastUserLng === coords.lng()) {
          console.log('user coords are the same ');
          return true;
        } else {
          console.log('user coords do not match!');
          return false;
        }  
      } else {
        this.userLocationLoadedOnce++;
      }
    }
    
    deleteCurrentMarker() {
      console.log('deleting current marker');
      this.userLocationMarker.setMap(null);
    }
    
    addCurrentMarker(coords, content, map) {
      let circle = {
          path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
          fillColor: '#5577F6',
          fillOpacity: .6,
          anchor: new google.maps.Point(0,0),
          strokeColor: 'white',
          strokeWeight: 2,
          scale: 0.5
         }
         
      if (this.checkCurrentMarkerIfSame(coords)) {
        return new Promise((resolve, reject) => {
          resolve('not adding a new marker');
        });
      } else {
        let pin = new google.maps.Marker({
          map: map,
          position: coords,
          icon: circle
        });
        let info = content;
        if (this.userLocationMarker) {
          this.deleteCurrentMarker();
        }
        this.userLocationMarker = pin;
        let currentBounds = this.map.getBounds();
        if (!this.checkIfUserLocationIsInBounds() && this.userLocationLoadedOnce > 1) {
          console.log('user location is not in current bounds! adding it!')
          currentBounds.extend(this.userLocationMarker.position);
          this.map.fitBounds(currentBounds);
        }
        return this.addInfoWindow(pin, info)
          .then(data => {
            return new Promise((resolve, reject) => {
              resolve(this.map);
              reject('error in adding marker');
            });
          });
      } 
    }
    
   checkIfUserLocationIsInBounds() {
     if (this.map.getBounds().contains(this.userLocationMarker.position)) {
       return true;
     } else {
       return false;
     }
   }

    addInfoWindow(marker, content){
      console.log(content);
      let infoWindow = new google.maps.InfoWindow({
        content: content
      });
      
      return new Promise((resolve, reject) => {
        google.maps.event.addListener(this.map, "click", event => {
          infoWindow.close();
        });
        resolve(google.maps.event.addListener(marker, 'click', () => {
          infoWindow.open(this.map, marker);
        }));
        reject('there was an error when adding info window');
      })
    }
    
    finalMapMaker(previousPlaces, previousTasks) {
      let finalMapMakerPromise = new Promise((resolve, reject) => {
        let finalLat = parseFloat(previousPlaces[previousPlaces.length - 1].location.coordinate.latitude);
        let finalLng = parseFloat(previousPlaces[previousPlaces.length - 1].location.coordinate.longitude);
        this.loadMap(finalLat, finalLng, 12, null, this.map)
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
            // reset userLocation
            this.userLocationLoadedOnce = 0;
            this.userLocationMarker = null;
           
            resolve(flightPath); 
          });
      });
      return finalMapMakerPromise;
    }
    
  }