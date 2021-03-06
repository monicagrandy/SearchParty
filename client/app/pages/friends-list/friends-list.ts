import {Page, NavController, NavParams, LocalStorage, Storage} from 'ionic-angular';
import {FriendService} from '../../services/friend/friend-service';
import {FORM_DIRECTIVES} from 'angular2/common';

@Page({
  templateUrl: 'build/pages/friends-list/friends-list.html',
  providers: [FriendService],
  directives: [FORM_DIRECTIVES]
})
export class FriendsListPage {
  local: Storage = new Storage(LocalStorage);
  token: any;
  friends: any;
  huntID: any;

  constructor(
    private nav: NavController,
    navParams: NavParams,
    private _friendService: FriendService
  ) {
    this.token = this.local.get('id_token')._result;
    this.huntID = navParams.get('huntID');
    console.log("hunt ID in friends-list", this.huntID);
    let userData = {token: this.token};
    this._friendService.postData(userData, 'getFriends')
      .then(data => {
        console.log('friends gotten! ', data);
        this.friends = data;
      })
        .catch(error => console.error(error));
  }

  friendTappedToHunt(event, friend) {
    console.log('friend tapped ', friend);
    let dataToSend = {huntID: this.huntID, friendUsername: friend.username};
    this._friendService.postData(dataToSend, 'addFriendToHunt')
      .then(data => {
        console.log("this friend was added to your hunt", data);
      })
        .catch(error => console.error(error));
  }
}
