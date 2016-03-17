import { Injectable } from 'angular2/core';;
import { TaskPage } from '../../pages/tasks/tasks' 
//import google-maps


//set injectable
@Injectable()
  export class GoogleMap {
    constructor(private userLoc:TaskPage){
      this.map = null;
      this.userLng = userLoc.login.local.get('userLat');  
      this.userLat = userLoc.login.local.get('userLng');
      this.loadMap();
    }

    loadMap(){
      let options = { timeout: 10000, enableHighAccuracy: true}
      let latLng = new google.maps.LatLng(this.userLng, this.userLat);
      let mapOptions = {
        center: latlng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(document.getElementById('map'), mapOptions)
    }
  }



//make map