import {Page, NavController, NavParams} from 'ionic-angular';
import {GoogleMapService} from '../../services/map/map-service';

@Page({
  templateUrl: 'build/pages/past-hunts/past-hunts.html',
  providers: [
    GoogleMapService
  ]
})
export class PastHuntsPage {
  map = null;
  previousPlaces: any;
  previousTasks: any;
  huntID: any;
  finalDist: any;
  previousHuntTasksAndLocations: any;

  constructor(private nav: NavController, navParams: NavParams, private googleMaps: GoogleMapService) {
    this.huntID = navParams.get('huntID');
    this.previousHuntTasksAndLocations = navParams.get('previousHuntTasksAndLocations');
    console.log('this is the previousHuntTasksAndLocations ', this.previousHuntTasksAndLocations);
    this.previousPlaces = this.previousHuntTasksAndLocations.map(hunt => hunt.place);
    this.previousTasks = this.previousHuntTasksAndLocations.map(hunt => hunt.task);
    console.log('this is the previous places mapped ', this.previousPlaces);
    console.log('this is the previous tasks mapped ', this.previousTasks);
    
    setTimeout(()=>{ 
      this.googleMaps.finalMapMaker(this.previousPlaces, this.previousTasks)
        .then(data => {
          console.log(data);
          let flightPath = data;
        }), 2000 });
    
    this.finalDist = this.googleMaps.calcDistance(this.previousPlaces);
  }
  
}
