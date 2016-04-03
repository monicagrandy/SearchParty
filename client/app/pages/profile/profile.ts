import {Page, NavController, NavParams, LocalStorage, Storage} from 'ionic-angular';
import {ProfileService} from '../../services/profile/profile-service';
import {FriendService} from '../../services/friend/friend-service';
import {AuthService} from '../../services/auth/auth-service';
import {FORM_DIRECTIVES} from 'angular2/common';
import {PastHuntsPage} from '../past-hunts/past-hunts';
import {FriendPage} from '../friend/friend';
import {FriendsListPage} from '../friends-list/friends-list';
import {JwtHelper} from 'angular2-jwt';
import {HuntFilterPipe} from '../../util/filter-pipe';
import {TaskPage} from '../tasks/tasks';
import {TaskService} from '../../services/task/task-service';

@Page({
  templateUrl: 'build/pages/profile/profile.html',
  providers: [ProfileService, FriendService, TaskService],
  directives: [FORM_DIRECTIVES],
  pipes: [HuntFilterPipe]
})
export class ProfilePage {
  local: Storage = new Storage(LocalStorage);
  hunts: any;
  token: any;
  friends: any;
  friendName: any;
  user: any;
  jwtHelper: JwtHelper = new JwtHelper();
  addedHunts: any;
  noFriend = false;

  constructor(
    private nav: NavController,
    navParams: NavParams,
    private profileService: ProfileService,
    private auth: AuthService,
    private friendService: FriendService,
    private taskService: TaskService
  ) {

    this.token = this.local.get('id_token')._result;

    if (this.token) {
      this.user = this.jwtHelper.decodeToken(this.token).username;
    }

    this.friendName = "";

    console.log('this is the token before it is sent', this.token);

    this.profileService.getProfile(this.token)
    .then(data => {
      console.log(data.hunts);
      let huntsWithAtleastOneTask = [];
      for (let hunt of data.hunts) {
        if (hunt.tasks.length > 0) {
          huntsWithAtleastOneTask.push(hunt);
        }
      }
      this.hunts = huntsWithAtleastOneTask;
    })
    .catch(error => console.log(error));

    this.profileService.addedHunts(this.user)
      .then(data => {
        console.log("these are the added hunts in profile.ts", data)
        this.addedHunts = data.hunts;
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
    console.log('hunt tapped', hunt)
    this.nav.push(PastHuntsPage, {
      previousHuntTasksAndLocations: hunt.tasks,
      huntID: hunt.stats.huntID,
      huntName: hunt.stats.huntname || 'Fun',
    });
  }

  onGoingHuntTapped(event, hunt) {
    console.log('this is the hunt length ', hunt.tasks.length);
    // format previousTasks and PreviousPlaces
    let previousPlaces = [];
    let previousTasks = [];

    for (let task of hunt.tasks) {
      previousPlaces.push(task.place);
      previousTasks.push(task.task);
    }

    let currentChallenge = previousTasks.pop();
    let currentPlace = previousPlaces.pop();

    this.nav.setRoot(TaskPage, {
      previousTasks: previousTasks,
      previousPlaces: previousPlaces,
      huntID: hunt.stats.huntID,
      huntName: hunt.stats.huntname || 'Fun',
      currChallenge: currentChallenge.content,
      locName: currentPlace.name,
      locAddress: currentPlace.address,
      locLat: currentPlace.lat,
      locLng: currentPlace.lng,
      resumeHuntKeywordsLeft: hunt.tasks.length
    });
  }

  addFriend(friend) {
    console.log(friend);
    this.friendService.addFriend(this.token, friend)
    .then(data => {
        console.log('friend added! ', data);
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
    this.friendName = "";
    setTimeout(() => { this.noFriend = false }, 1000);
  }

  addFriendToHuntTapped(event, hunt) {
    this.nav.push(FriendsListPage, {
      huntID: hunt.stats.huntID
    })
  }
}
