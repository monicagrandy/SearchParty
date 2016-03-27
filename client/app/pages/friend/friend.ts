import {Page, NavController, NavParams, LocalStorage, Storage} from 'ionic-angular';
import {FriendService} from '../../services/friend/friend-service';
import {PastHuntsPage} from '../past-hunts/past-hunts';

@Page({
  templateUrl: 'build/pages/friend/friend.html',
  providers: [FriendService],
})
export class FriendPage {
  local: Storage = new Storage(LocalStorage);
  hunts: any;
  friend: any;
  // sample types for hunts and friends
  // friends: Array<{username: string, profile_image: string}>;
  // hunts: Array<{type: string, huntname: string, image: string, icon: string}>;

  constructor(
    private nav: NavController, 
    navParams: NavParams,
    private friendService: FriendService
    ) {
    this.friend = navParams.get('friend');
        
    this.friendService.getFriendHunt(this.friend.username)
      .then(data => {
        console.log(data.hunts);
        // this.friends = data.friends;
        this.hunts = data.hunts;
      })
        .catch(error => console.log(error));
        
  }
  

  huntTapped(event, hunt) {
    this.nav.push(PastHuntsPage, {
      previousHuntTasksAndLocations: hunt.tasks,
      huntID: hunt.stats.huntID
    });
  }

}
