import {Page, NavController, NavParams} from 'ionic-angular';


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

  constructor(private nav: NavController, navParams: NavParams) {
    this.huntID = navParams.get('huntID');
    this.previousPlaces = navParams.get('previousPlaces');
    this.previousTasks = navParams.get('previousTasks');
  }
  
}
