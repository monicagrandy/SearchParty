import { Injectable } from 'angular2/core';;
import { TaskPage } from '../../pages/tasks/tasks' 
//import google-maps


//set injectable
@Injectable({
  export class GoogleMap {
    constructor(private userLoc:TaskPage){
      this.map = null;
      this.userLng = userLoc.local.get('')
      this.userLat = userLoc.local.get('')
      this.loadMap;
    }
  }
}) 


//make map