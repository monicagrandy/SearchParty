import {Page, Platform, NavController, NavParams, LocalStorage} from 'ionic-angular';
import {TaskService} from '../../services/task/task-service';
import {GoogleMapService} from '../../services/map/map-service';
import {ConnectionBackend, HTTP_PROVIDERS} from 'angular2/http';
import {JwtHelper} from 'angular2-jwt';
import {NgZone} from 'angular2/core';
import {Camera} from 'ionic-native';
import {TemplatePage} from '../templates/templates';
import 'rxjs/add/operator/map';

//declare var Camera:any;

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
  locAddress: string; //set this to whatever is in local storage
  currChallenge: string;
  locLat: any; //set this to whatever is in local storage
  locLng: any; //set this to whatever is in local storage
  locName: string; //set this to whatever is in local storage
  completeToggle = false;
  keywords = ['Bar', 'Bar', 'Bar', 'Bar', 'Bar', 'Bar','Bar','Bar', 'Bar'];
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
  TASKS_URL: string = 'https://getsearchparty.com/tasks';
  FEEDBACK_URL: string = 'https://getsearchparty.com/feedback';
  UPLOAD_URL: string = 'http://172.20.10.2:8000/upload';
  feedback: string;


  constructor(platform: Platform, private nav: NavController, navParams: NavParams, private _taskService: TaskService, private googleMaps: GoogleMapService, _zone: NgZone) {
    // If we navigated to this page, we will have an item available as a nav param
    //this.map = null;
    this._zone = _zone;
    this.platform = platform;
    this.image = null;
    this.tasksLeft = true;
    //console.log(localStorage.id_token)
    this.token = localStorage.id_token;

    if (this.token) {
      this.user = this.jwtHelper.decodeToken(this.token).username;
    }

    this.locAddress = navParams.get('locAddress');
    this.huntID = navParams.get('huntID');
    this.currChallenge =  localStorage.currChallenge || navParams.get('currChallenge');
    this.locLat = localStorage.locLat || navParams.get('locLat');
    this.locLng = localStorage.locLng || navParams.get('locLng');
    this.locName = localStorage.locName || navParams.get('locName');
    this.previousPlaces = navParams.get('previousPlaces');
    this.previousTasks = navParams.get('previousTasks');
    let content = '<h4>' + this.locName + '</h4><p>' + this.locAddress  + '</p>';
    setTimeout(()=>{ this.googleMaps.loadMap(this.locLat, this.locLng, 15, content, this.map).then(map => this.map = map), 2000 })
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
      let count = this.keywords.length
      let dataObj = {
        count: count,
        huntID: this.huntID,
        image: this.imgData
       } 
      this._taskService.postData(JSON.stringify(dataObj), this.UPLOAD_URL)
        .then(result => {
          console.log("image sent to server")
        })
  }, (error) => {
      alert(error);
  });
}

  //this should be triggered when the next button is pushed
  getNewTask(){
    this.imgData = ""
    console.log('getting ready to send new task!')
    console.log(this.keywords);
    console.log('this is the huntID in the tasks! ');
    console.log(this.huntID);

    if (this.keywords.length > 0) {
      let keyword = this.keywords.shift();
      console.log('this is the huntID before it is sent! ', this.huntID);

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

      this._taskService.postData(JSON.stringify(dataObj), this.TASKS_URL)
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
        });

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
    this.endTime = new Date().toLocaleTimeString();
    localStorage.endTime = this.endTime;
    this.startTime = localStorage.startTime;

    this.googleMaps.finalMapMaker(this.previousPlaces, this.previousTasks)
      .then(data => {
        let flightPath = data;
      });

    this.finalDist = this.googleMaps.calcDistance(this.previousPlaces);
    //get all images associated with hunt from server and add each to a card
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
          endTime: localStorage.endTime,
          distance: this.finalDist,
          feedback: this.feedback
    };

    this._taskService.postData(JSON.stringify(userFeedback), this.FEEDBACK_URL)
      .then(result => {
        this.nav.setRoot(TemplatePage);
        console.log(result);
      });
  }

  //use this to check if user is allowed to move on to the next task
  markComplete(){
    console.log(this.completeToggle);
    if (this.completeToggle === false) {
      this.completeToggle = true;
    } else {
      this.completeToggle = false;
    }
    return this.completeToggle;
  }

}
