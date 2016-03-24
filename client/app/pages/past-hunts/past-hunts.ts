import {Page, NavController, NavParams} from 'ionic-angular';


@Page({
  templateUrl: 'build/pages/past-hunts/past-hunts.html'
})
export class PastHuntsPage {
  // sample types for hunts and friends
  // friends: Array<{username: string, profile_image: string}>;
  // hunts: Array<{type: string, huntname: string, image: string, icon: string}>;

  constructor(private nav: NavController, navParams: NavParams) {

  }
  
}
