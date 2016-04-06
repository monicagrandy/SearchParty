import {Page, Platform, NavController, NavParams, LocalStorage} from 'ionic-angular';
import {TaskService} from '../../services/task/task-service';
import {GoogleMapService} from '../../services/map/map-service';
import {JwtHelper} from 'angular2-jwt';
import {NgZone} from 'angular2/core';
import {Camera} from 'ionic-native';
import {TemplatePage} from '../templates/templates';
import {Chat} from '../chat/chat';

@Page({
  templateUrl: 'build/pages/tasks/tasks.html',
  providers: [
    TaskService,
    GoogleMapService
  ]
})
export class TaskPage {
  title = 'Current Task';
  map = null;
  local: LocalStorage;
  locAddress: string;
  currChallenge: string;
  userLat: any;
  userLong: any;
  locLat: any;
  locLng: any;
  locName: string;
  completeToggle = false;
  keywordsLength: number;
  tasksLeft: any;
  endHunt: boolean;
  startTime: any;
  endTime: any;
  user: string;
  jwtHelper: JwtHelper = new JwtHelper();
  token: any;
  previousPlaces: any;
  previousTasks: any;
  huntID: any;
  platform: any;
  image: any;
  imgData: string;
  finalDist: any;
  feedback: string;
  link: string;
  directionLink: string;
  finalData: any;
  text: string;
  url: string;
  hashtags: string;
  via: string;
  showURL: boolean;
  encodedTweetLink: any;
  resumeHuntKeywordsLeft: number;
  socket: any;
  io: any;
  taskNumber: any;
  huntName: any;
  keywordsArray: any;
  totalNumberOfTasks: any;
  endTimeUnix: number;
  startTimeUnix: number;

  constructor(
    platform: Platform,
    private nav: NavController,
    private _navParams: NavParams,
    private _taskService: TaskService,
    private _googleMaps: GoogleMapService,
    private _zone: NgZone
  ) {
    this.showURL = false;
    this.platform = platform;
    this.image = null;
    this.tasksLeft = true;
    this.token = localStorage.id_token;

    if (this.token) {
      this.user = this.jwtHelper.decodeToken(this.token).username;
    }
    
    this.grabParamters();
    this.buildTwitterLink();
    
    // create socket
    this._taskService.createSocket(this.huntID, this.user);
    // geowatching setup
    this._taskService.createWatchLocation();
    
    let content = '<h4>' + this.locName + '</h4><p>' + this.locAddress  + '</p>';
    this.directionLink = `https://www.google.com/maps/dir/${this.userLat},${this.userLong}/${this.locAddress}`;
    setTimeout(() => {
      this._googleMaps.loadMap(this.locLat, this.locLng, 15, content)
        .then(map => console.log('map created'))});
  }

  takePic() {
    this._taskService.takePic()
      .then(image => this.imgData = image);
    // console.log('taking picture');
    // let options = {
    //   destinationType: 0,
    //   sourceType: 1,
    //   encodingType: 0,
    //   targetWidth: 1024,
    //   targetHeight: 1024,
    //   quality:100,
    //   allowEdit: false,
    //   saveToPhotoAlbum: false
    // };
    // Camera.getPicture(options).then((data) => {
    //   this.imgData = 'data:image/jpeg;base64,' + data;
    //   this._zone.run(() => this.image = this.imgData);

    //   let dataObj = {
    //     huntID: this.huntID
    //   }
    //   this._taskService.postData(dataObj, 'singleHunt')
    //   .then(entireHuntData => {
    //     let currentTaskNumber = entireHuntData.huntData.tasknumber;
    //     let dataObj = {
    //       count: currentTaskNumber,
    //       huntID: this.huntID,
    //       image: this.imgData
    //     };
    //     this._taskService.postData(dataObj, 'upload')
    //     .then(result => {
    //       console.log("image sent to server");
    //     }).catch(error => console.error(error));
    //   })
    // }, (error) => {
    //   alert(error);
    // });
  }

  getNewTask() {
    this.imgData = ""
    this.showURL = false;

    if (this.taskNumber !== this.totalNumberOfTasks) {
      let keyword = this.keywordsArray.shift();
      this.sendData(keyword.name);
    } else {
      this.tasksLeft = false;
      this.searchComplete();
    }
  }

  searchComplete() {
    this._taskService.searchComplete(this.previousPlaces, this.previousTasks)
      .then(result => {
        this.endTime = new Date().toLocaleTimeString();
        this.endTimeUnix = Date.now();
        localStorage.endTime = this.endTime;
        this.startTime = localStorage.startTime;
        this.startTimeUnix = localStorage.startTimeUnix;
        this.finalData = result.finalData;
        this.finalDist = result.finalDist;
      })
        .catch(error => console.log(error));
    
  }

  sendFeedback(val) {
    if (val === 1) {
      console.log('sending good feedback!');
      this.feedback = "good";
    }

    if (val === 2) {
      console.log('sending bad feedback!');
      this.feedback = "bad";
    }
    
    let userFeedback = {
      token: localStorage.id_token,
      huntID: this.huntID,
      endTime: this.endTimeUnix,
      distance: this.finalDist,
      feedback: this.feedback
    };

    this._taskService.postData(userFeedback, 'feedback')
      .then(result => {
        this.nav.setRoot(TemplatePage);
        console.log(result);
      });
  }

  markComplete() {
    console.log(this.completeToggle);
    if (this.completeToggle === false) {
      this.completeToggle = true;
    } else {
      this.completeToggle = false;
    }
    return this.completeToggle;
  }

  shareWeb(text) {
    this.showURL = true;
    console.log(this.link);
    return this.showURL;
  }

  chat(event) {
    this.nav.push(Chat, {
      huntID: this.huntID
    });
  }

  sendData(keyword) {
    this._taskService.getNewTask(keyword, this.previousPlaces, this.previousTasks, this.locLat, this.locLng, this.huntName)
      .then(result => {
        this.locName = result.locName;
        this.currChallenge = result.currChallenge;
        this.previousPlaces = result.previousPlaces;
        this.locAddress = result.locAddress;
        this.previousTasks = result.previousTasks;
        this.locLat = result.locLat;
        this.locLng = result.locLng;
        this.taskNumber = result.taskNumber;
        this.totalNumberOfTasks = result.totalNumberOfTasks;        
        this.markComplete();
      });
  }
  
  grabParamters() {
    this.keywordsArray = this._navParams.get('keywordsArray')
    this.locAddress = this._navParams.get('locAddress');
    this.userLat = localStorage.userLat;
    this.userLong = localStorage.userLng;
    this.huntID = this._navParams.get('huntID');
    this.currChallenge =  localStorage.currChallenge || this._navParams.get('currChallenge');
    this.locLat = localStorage.locLat || this._navParams.get('locLat');
    this.locLng = localStorage.locLng || this._navParams.get('locLng');
    this.locName = localStorage.locName || this._navParams.get('locName');
    this.huntName = localStorage.huntName || this._navParams.get('huntName');
    this.previousPlaces = this._navParams.get('previousPlaces');
    this.previousTasks = this._navParams.get('previousTasks');
    this.taskNumber = this._navParams.get('taskNumber');
    this.totalNumberOfTasks = this._navParams.get('totalNumberOfTasks');
  }
  
  buildTwitterLink() {
    this.link = `https://getsearchparty.com/share/#/hunt/${this.user}/${this.huntID}`;
    this.text = encodeURIComponent('I am going on an adventure! Follow me on Search Party!');
    this.hashtags = 'searchparty';
    this.via = 'GetSearchParty';
    this.url = encodeURIComponent(this.link);
    this.encodedTweetLink = `https://twitter.com/intent/tweet?hashtags=${this.hashtags}&url=${this.url}&text=${this.text}&via=${this.via}`;
  }

}
