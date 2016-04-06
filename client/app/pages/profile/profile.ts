import {Page, NavController, NavParams, LocalStorage, Storage} from 'ionic-angular';
import {ProfileService} from '../../services/profile/profile-service';
import {FriendService} from '../../services/friend/friend-service';
import {FORM_DIRECTIVES} from 'angular2/common';
import {PastHuntsPage} from '../past-hunts/past-hunts';
import {FriendPage} from '../friend/friend';
import {FriendsListPage} from '../friends-list/friends-list';
import {JwtHelper} from 'angular2-jwt';
import {HuntFilterPipe} from '../../util/filter-pipe';
import {TaskPage} from '../tasks/tasks';
import {TemplateService} from '../../services/template/template-service';

@Page({
  templateUrl: 'build/pages/profile/profile.html',
  providers: [ProfileService, FriendService, TemplateService],
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
  keywordsArray: any;

  constructor(
    private nav: NavController,
    navParams: NavParams,
    private profileService: ProfileService,
    private friendService: FriendService,
    private templateService: TemplateService
  ) {

    this.token = this.local.get('id_token')._result;

    if (this.token) {
      this.user = this.jwtHelper.decodeToken(this.token).username;
    }

    this.friendName = "";

    console.log('this is the token before it is sent', this.token);
    
    let tokenData = { token: this.token };
    
    this.profileService.postData(tokenData, 'userProfile')
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
        
    let userData = { username: this.user };
    
    this.profileService.postData(userData, 'getAddedHunts')
      .then(data => {
        console.log("these are the added hunts in profile.ts", data)
        this.addedHunts = data.hunts;
      })    
        .catch(error => console.log(error));

    this.friendService.postData(tokenData, 'getFriends')
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
      console.log('this is the hunt.tasks ', hunt.tasks);
      console.log('this is the task from hunt.tasks ', task);
      previousPlaces.push(task.place);
      previousTasks.push(task.task);
    }
    
    console.log('this is the previous places  ++++', previousPlaces);
    
    let currentChallenge = previousTasks[previousTasks.length - 1];
    let currentPlace = previousPlaces[previousPlaces.length - 1];
    
    let data = {
      templateName: hunt.stats.templatename
    };
    
    console.log('this is the data being sent to template service ', data);
    
    this.templateService.postData(data, 'template')
      .then(template => { 
        console.log('this is the data from posttemplate ', template);
        this.keywordsArray = template.keywords;
        // take away from the end based on number of tasks originally selected
        this.keywordsArray.splice(hunt.stats.totalnumberoftasks, this.keywordsArray.length - hunt.stats.totalnumberoftasks);
        // take away from the beginning based on number of tasks already completed
        this.keywordsArray.splice(0, hunt.stats.tasknumber);
        console.log('this is they keywordsArray', this.keywordsArray);
        this.nav.setRoot(TaskPage, {
          locAddress: currentPlace.address,
          huntID: hunt.stats.huntID,
          taskNumber: hunt.stats.tasknumber,
          huntName: hunt.stats.huntname || 'Fun',
          currChallenge: currentChallenge.content,
          locLat: currentPlace.lat,
          locLng: currentPlace.lng,
          locName: currentPlace.name,
          previousPlaces: previousPlaces,
          previousTasks: previousTasks,
          keywordsArray: this.keywordsArray,
          totalNumberOfTasks: hunt.stats.totalnumberoftasks
        });
      });
  }

  addFriend(friend) {
    console.log(friend);
    let dataToSend = { token: this.token, friendusername: friend.username };
    this.friendService.postData(dataToSend, 'addFriend')
      .then(data => {
          console.log('friend added! ', data);
          let tokenData = { token: this.token };
          this.friendService.postData(tokenData, 'getFriends')
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
