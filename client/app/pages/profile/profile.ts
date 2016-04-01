import {Page, NavController, NavParams, LocalStorage, Storage} from 'ionic-angular';
import {ProfileService} from '../../services/profile/profile-service';
import {FriendService} from '../../services/friend/friend-service';
import {AuthService} from '../../services/auth/auth-service';
import {FORM_DIRECTIVES} from 'angular2/common';
import {PastHuntsPage} from '../past-hunts/past-hunts';
import {FriendPage} from '../friend/friend';
import {FriendsListPage} from '../friends-list/friends-list';
import {FilterPipe} from '../../util/filter-pipe';
import {JwtHelper} from 'angular2-jwt';

@Page({
  templateUrl: 'build/pages/profile/profile.html',
  providers: [ProfileService, FriendService],
  directives: [FORM_DIRECTIVES],
  pipes: [FilterPipe]
})
export class ProfilePage {
  local: Storage = new Storage(LocalStorage);
  hunts: any;
  token: any;
  friends: any;
  user: any;
  jwtHelper: JwtHelper = new JwtHelper();
  addedHunts: any;
  noFriend: false;
  // sample types for hunts and friends
  // friends: Array<{username: string, profile_image: string}>;
  // hunts: Array<{type: string, huntname: string, image: string, icon: string}>;

  constructor(
    private nav: NavController,
    navParams: NavParams,
    private profileService: ProfileService,
    private auth: AuthService,
    private friendService: FriendService
    ) {
    this.token = this.local.get('id_token')._result;

    if (this.token) {
      this.user = this.jwtHelper.decodeToken(this.token).username;
    }

    console.log('this is the token before it is sent', this.token);

    this.profileService.getProfile(this.token)
      .then(data => {
        console.log(data.hunts);
        // this.friends = data.friends;
        this.hunts = data.hunts;
      })
        .catch(error => console.log(error));

    this.profileService.addedHunts(this.user)
      .then(data => {
        console.log("these are the added hunts in profile.ts", data)
        this.addedHunts = data[0]
      })    
      .catch(error => console.log(error));

    this.friendService.getFriends(this.token)
      .then(data => {
        console.log('friends gotten! ', data);
        this.friends = data;
      })
        .catch(error => console.log(error));
  }

  friendTapped(event, friend) {
    this.nav.push(FriendPage, {
      friend: friend
    });
  }

  huntTapped(event, hunt) {
    this.nav.push(PastHuntsPage, {
      previousHuntTasksAndLocations: hunt.tasks,
      huntID: hunt.stats.huntID
    });
  }

  addFriend(friend) {
    console.log(friend);
    this.friendService.addFriend(this.token, friend)
      .then(data => {
        console.log('friend added! ', data);
        // update friendslist after friend is added
        this.friendService.getFriends(this.token)
          .then(data => {
            console.log('friends gotten! ', data);
            this.friends = data;
          })
            .catch(error => {
              this.noFriend = true
              console.log(error)
            })
        })
      .catch(error => {
        this.noFriend = true
        console.log(error)
      })
    setTimeout(() => { this.noFriend = false }, 1000);
  }

  addFriendToHuntTapped(event, hunt) {
    this.nav.push(FriendsListPage, {
      huntID: hunt.stats.huntID
    })
  }
}
