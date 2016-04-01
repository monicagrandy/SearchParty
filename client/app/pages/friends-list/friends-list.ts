import {Page, NavController, NavParams, LocalStorage, Storage} from 'ionic-angular';
import {ProfileService} from '../../services/profile/profile-service';
import {FriendService} from '../../services/friend/friend-service';
import {AuthService} from '../../services/auth/auth-service';
import {FORM_DIRECTIVES} from 'angular2/common';

@Page({
  templateUrl: 'build/pages/friends-list/friends-list.html',
  providers: [ProfileService, FriendService],
  directives: [FORM_DIRECTIVES]
})

export class FriendsListPage {
  local: Storage = new Storage(LocalStorage);
  token: any;
  friends: any;

  constructor(
    private nav: NavController,
    navParams: NavParams,
    private profileService: ProfileService,
    private auth: AuthService,
    private friendService: FriendService
  ) {
    this.token = this.local.get('id_token')._result;
    this.huntID = navParams.get('huntID');
    console.log("hunt ID in friends-list", this.huntID);
    this.friendService.getFriends(this.token)
    .then(data => {
      console.log('friends gotten! ', data);
      this.friends = data;
    })
    .catch(error => console.log(error));
  }

  friendTappedToHunt(event, friend) {
    console.log('friend tapped ', friend);
    this.friendService.addFriendToHunt(this.huntID, friend)
    .then(data => {
      console.log("this friend was added to your hunt", data);
    })
    .catch(error => console.log(error));
  }
}