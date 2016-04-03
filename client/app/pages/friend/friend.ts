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

  constructor(
    private nav: NavController,
    navParams: NavParams,
    private friendService: FriendService
    ) {
    this.friend = navParams.get('friend');

    this.friendService.getFriendHunt(this.friend.username)
      .then(data => {
        this.hunts = data.hunts;
      })
        .catch(error => console.error(error));
        
  }

  huntTapped(event, hunt) {
    this.nav.push(PastHuntsPage, {
      previousHuntTasksAndLocations: hunt.tasks,
      huntID: hunt.stats.huntID,
      huntName: hunt.stats.huntname || 'Fun'
    });
  }

}
