import {Page, Platform, NavController, NavParams, LocalStorage} from 'ionic-angular';
import {TaskService} from '../../services/task/task-service';
import {GoogleMapService} from '../../services/map/map-service';
import {ConnectionBackend, HTTP_PROVIDERS} from 'angular2/http';
import {JwtHelper} from 'angular2-jwt';
import {NgZone} from 'angular2/core';
import {Camera} from 'ionic-native';
import {TemplatePage} from '../templates/templates';
import {Chat} from '../chat/chat';
import 'rxjs/add/operator/map';

@Page({
  templateUrl: 'build/pages/tasks/tasks.html',
  providers: [
    ConnectionBackend,
    HTTP_PROVIDERS,
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
  // keywords = (navParams.get('taskNumber'))
  // ['Bar', 'Bar', 'Bar', 'Bar', 'Bar', 'Bar','Bar','Bar', 'Bar'];
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
  _zone: any;
  platform: any;
  image: any;
  imgData: string;
  finalDist: any;
  HUNT_URL: string = 'https://getsearchparty.com/singleHunt';
  TASKS_URL: string = 'https://getsearchparty.com/tasks';
  FEEDBACK_URL: string = 'https://getsearchparty.com/feedback';
  UPLOAD_URL: string = 'https://getsearchparty.com/upload';
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


  constructor(
    platform: Platform,
    private nav: NavController,
    navParams: NavParams,
    private _taskService: TaskService,
    private googleMaps: GoogleMapService,
    _zone: NgZone
    ) {
      this.taskNumber = navParams.get('taskNumber');
    this.keywordsLength = this.keywords.length;

    this.showURL = false;
    this._zone = _zone;
    this.platform = platform;
    this.image = null;
    this.tasksLeft = true;
    let socket = io.connect('http://localhost:8000');
    this.socket = socket;
    this.token = localStorage.id_token;

    if (this.token) {
      this.user = this.jwtHelper.decodeToken(this.token).username;
    }
    this.locAddress = navParams.get('locAddress');
    this.userLat = localStorage.userLat;
    this.userLong = localStorage.userLng;
    this.huntID = navParams.get('huntID');
    this.currChallenge =  localStorage.currChallenge || navParams.get('currChallenge');
    this.locLat = localStorage.locLat || navParams.get('locLat');
    this.locLng = localStorage.locLng || navParams.get('locLng');
    this.locName = localStorage.locName || navParams.get('locName');
    this.previousPlaces = navParams.get('previousPlaces');
    this.resumeHuntKeywordsLeft = navParams.get('resumeHuntKeywordsLeft');

    this.previousTasks = navParams.get('previousTasks');
    if (this.previousTasks.length > 1) {
      console.log('resuming hunt!');
      console.log('this is the previous place ', this.previousPlaces);
      console.log('this is the previous task ', this.previousTasks);
      this.keywords.splice(0, this.resumeHuntKeywordsLeft);
    }


    this._taskService.createSocket(this.huntID, this.user);
    // geowatching setup
    this._taskService.createWatchLocation();
    this.link = `https://getsearchparty.com/share/#/hunt/${this.user}/${this.huntID}`;
    this.directionLink = `https://www.google.com/maps/dir/${this.userLat},${this.userLong}/${this.locAddress}`;
    this.text = encodeURIComponent('I am going on an adventure! Follow me on Search Party!');
    this.hashtags = 'searchparty';
    this.via = 'GetSearchParty';
    this.url = encodeURIComponent(this.link);
    this.encodedTweetLink = `https://twitter.com/intent/tweet?hashtags=${this.hashtags}&url=${this.url}&text=${this.text}&via=${this.via}`;
    let content = '<h4>' + this.locName + '</h4><p>' + this.locAddress  + '</p>';
    setTimeout(()=>{ this.googleMaps.loadMap(this.locLat, this.locLng, 15, content, this.map).then(map => this.map = map), 2000 });
  }


takePic() {
  console.log('taking picture')
  let options = {
      destinationType: 0,
      sourceType: 1,
      encodingType: 0,
      targetWidth: 1024,
      targetHeight: 1024,
      quality:100,
      allowEdit: false,
      saveToPhotoAlbum: false
  };
  Camera.getPicture(options).then((data) => {
    this.imgData = 'data:image/jpeg;base64,' + data;
      this._zone.run(() => this.image = this.imgData);
      let count = this.keywordsLength - this.keywords.length
      let dataObj = {
        count: count,
        huntID: this.huntID,
        image: this.imgData
       }
      this._taskService.postData(JSON.stringify(dataObj), 'upload')
        .then(result => {
          console.log("image sent to server")
        })
  }, (error) => {
      alert(error);
  });
}

  getNewTask(){
    console.log(this.keywordsLength - this.keywords.length)
    this.imgData = ""
    this.showURL = false;
    console.log('getting ready to send new task!')
    console.log(this.keywords);
    console.log('this is the huntID in the tasks! ');
    console.log(this.huntID);

    if (this.keywords.length > 0) {
      let keyword = this.keywords.shift();
      console.log('this is the huntID before it is sent! ', this.huntID);
      this.sendData(keyword);
    } else {
      console.log('no more tasks!');
      console.log(this.previousTasks);
      console.log(this.previousPlaces);
      this.tasksLeft = false;
      this.searchComplete();
    }
  }

  searchComplete(){
    console.log(this.previousTasks);
    let dataObj = {
      huntID: this.huntID
    }
    this._taskService.postData(JSON.stringify(dataObj), 'hunt')
        .then(result => {
         this.finalData = result.tasks
          console.log("+++line 179 in tasks.js data: ", result)
      })
    this.endTime = new Date().toLocaleTimeString();
    this.endTimeUnix = Date.now();
    localStorage.endTime = this.endTime;
    this.startTime = localStorage.startTime;
    this.startTimeUnix = localStorage.startTimeUnix;

    this.googleMaps.finalMapMaker(this.previousPlaces, this.previousTasks)
      .then(data => {
        let flightPath = data;
      });

    this.finalDist = this.googleMaps.calcDistance(this.previousPlaces);
  }

  sendFeedback(val){
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

    this._taskService.postData(JSON.stringify(userFeedback), 'feedback')
      .then(result => {
        this.nav.setRoot(TemplatePage);
        console.log(result);
      });
  }

  markComplete(){
    console.log(this.completeToggle);
    if (this.completeToggle === false) {
      this.completeToggle = true;
    } else {
      this.completeToggle = false;
    }
    return this.completeToggle;
  }

  share(message, subject, file) {
    if(window.plugins.socialsharing) {
      window.plugins.socialsharing.share(message, subject, file, this.link);
    }
  }

  shareViaTwitter(message, image) {
    if(window.plugins.socialsharing) {
      window.plugins.socialsharing.canShareVia("twitter", message, (Date.now())/1000, image, this.link, result => {
          window.plugins.socialsharing.shareViaTwitter(message, image, link);
      }, error => {
          console.error(error);
      });
    }
  }

  shareWeb(text) {
    this.showURL = true
    console.log(this.link);
    return this.showURL;
  }

  chat(event) {
    this.nav.push(Chat, {
      huntID: this.huntID
    });
  }

  sendData(keyword) {
    let dataObj = {
      previousPlaces: this.previousPlaces,
      previousTasks: this.previousTasks,
      keyword: keyword,
      token: localStorage.id_token,
      huntID: this.huntID,
      geolocation: {
        lat: this.locLat,
        lng: this.locLng
      }
    };

    this._taskService.postData(JSON.stringify(dataObj), 'tasks')
      .then(result => {
        this.locName = result.businesses.name;
        this.currChallenge = result.tasks.content;
        this.previousPlaces.push(result.businesses);
        this.locAddress = result.businesses.location.display_address[0] + ', ' + result.businesses.location.display_address[2];
        this.previousTasks.push(result.tasks);
        this.locLat = result.businesses.location.coordinate.latitude;
        this.locLng = result.businesses.location.coordinate.longitude;
        this.markComplete();
        let content = '<h4>' + this.locName + '</h4><p>' + this.locAddress  + '</p>';
        this.map = this.googleMaps.loadMap(this.locLat, this.locLng, 15, content, this.map);
        this.refreshFeed(this.locName, this.currChallenge, this.huntID, this.locLat, this.locLng, 15);
      });
   }
   refreshFeed(name, task, room, lat, lng, zoom) {
      this.socket.emit('taskChange', name, task, room, lat, lng, zoom);
      console.log('::::EMITTED SOCKET:::::');
   }

}
