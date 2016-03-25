import {Page, NavController, NavParams} from 'ionic-angular';
import {GoogleMapService} from '../../services/task-service/map-service';
import {TaskService} from '../../services/task-service/task-service';

@Page({
  templateUrl: 'build/pages/past-hunts/past-hunts.html'
})
export class PastHuntsPage {
  // sample types for hunts and friends
  // friends: Array<{username: string, profile_image: string}>;
  // hunts: Array<{type: string, huntname: string, image: string, icon: string}>;
  map = null;
  previousPlaces: any;
  previousTasks: any;
  huntID: any;
  finalDist: any;

  constructor(private nav: NavController, navParams: NavParams, private googleMaps: GoogleMapService, private taskService: TaskService) {
    this.huntID = navParams.get('huntID');
    this.previousPlaces = navParams.get('previousPlaces');
    this.previousTasks = navParams.get('previousTasks');
  }
  
}
