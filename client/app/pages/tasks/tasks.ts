import {Page, NavController, NavParams, LocalStorage} from 'ionic-angular';
import {TaskService} from '../../services/task-service/task-service';
import { ConnectionBackend, HTTP_PROVIDERS } from 'angular2/http';
import {JwtHelper} from 'angular2-jwt';
import {TemplatePage} from '../templates/templates';
import 'rxjs/add/operator/map';


@Page({
  templateUrl: 'build/pages/tasks/tasks.html',
  providers: [
    ConnectionBackend,
    HTTP_PROVIDERS,
    TaskService
  ]
})

export class TaskPage {
  title = 'Current Task'
  map = null;
  local: LocalStorage
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
  finalDist: any;
  TASKS_URL: string = process.env.TASKSURL || 'http://localhost:8000/tasks';
  FEEDBACK_URL: string = process.env.FEEDBACKURL || 'http://localhost:8000/feedback';
  feedback: string;


  constructor(private nav: NavController, navParams: NavParams, private _taskService: TaskService) {
    // If we navigated to this page, we will have an item available as a nav param
    //this.map = null;
    this.tasksLeft = true;
    //console.log(localStorage.id_token)
    this.token = localStorage.id_token;
    
    if (this.token) {
      this.user = this.jwtHelper.decodeToken(this.token).username;
    }
    
    this.locAddress = navParams.get('locAddress');
    this.huntID = navParams.get('huntID');
    this.currChallenge = navParams.get('currChallenge');
    this.locLat = navParams.get('locLat');
    this.locLng = navParams.get('locLng');
    this.locName = navParams.get('locName');
    this.previousPlaces = navParams.get('previousPlaces');
    this.previousTasks = navParams.get('previousTasks');
    setTimeout(()=>{ this.loadMap(this.locLat, this.locLng, 15), 2000 })
  }

  //this should be triggered when the next button is pushed
  getNewTask(){
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
          this.loadMap(this.locLat, this.locLng, 15);
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
    console.log(this.previousTasks)
    this.endTime = new Date().toLocaleTimeString()
    localStorage.endTime = this.endTime
    this.startTime = localStorage.startTime
    let finalLat = this.previousPlaces[9].location.coordinate.latitude
    let finalLng = this.previousPlaces[9].location.coordinate.longitude
    this.loadMap(finalLat, finalLng, 12)
    let bounds = new google.maps.LatLngBounds();
    let points = []
    for(let i = 0; i < this.previousPlaces.length; i++){
      let currLat = this.previousPlaces[i].location.coordinate.latitude
      let currLng = this.previousPlaces[i].location.coordinate.longitude
      let name = this.previousPlaces[i].name
      let currChallenge = this.previousTasks[i].content
      let currPos = new google.maps.LatLng(currLat, currLng);
      let info = '<h4>' + currChallenge + '</h4><p>' + name  + '</p>'
      points.push(new google.maps.LatLng(currLat, currLng))
      this.addMarker(currPos, info);
      bounds.extend(currPos);
      this.map.fitBounds(bounds);
    }
    let flightPath = new google.maps.Polyline({
      map: this.map,
      path: points,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    this.calcDistance()

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

  calcDistance(){
    let latLng0 = new google.maps.LatLng(this.previousPlaces[0].location.coordinate.latitude, this.previousPlaces[0].location.coordinate.longitude);
    let latLng1 = new google.maps.LatLng(this.previousPlaces[1].location.coordinate.latitude, this.previousPlaces[1].location.coordinate.longitude);
    let latLng2 = new google.maps.LatLng(this.previousPlaces[2].location.coordinate.latitude, this.previousPlaces[2].location.coordinate.longitude);
    let latLng3 = new google.maps.LatLng(this.previousPlaces[3].location.coordinate.latitude, this.previousPlaces[3].location.coordinate.longitude);
    let latLng4 = new google.maps.LatLng(this.previousPlaces[4].location.coordinate.latitude, this.previousPlaces[4].location.coordinate.longitude);
    let latLng5 = new google.maps.LatLng(this.previousPlaces[5].location.coordinate.latitude, this.previousPlaces[5].location.coordinate.longitude);
    let latLng6 = new google.maps.LatLng(this.previousPlaces[6].location.coordinate.latitude, this.previousPlaces[6].location.coordinate.longitude);
    let latLng7 = new google.maps.LatLng(this.previousPlaces[7].location.coordinate.latitude, this.previousPlaces[7].location.coordinate.longitude);
    let latLng8 = new google.maps.LatLng(this.previousPlaces[8].location.coordinate.latitude, this.previousPlaces[8].location.coordinate.longitude);
    let latLng9 = new google.maps.LatLng(this.previousPlaces[9].location.coordinate.latitude, this.previousPlaces[9].location.coordinate.longitude);
    let dist0 = google.maps.geometry.spherical.computeDistanceBetween (latLng0, latLng1);
    let dist1 = google.maps.geometry.spherical.computeDistanceBetween (latLng1, latLng2);
    let dist2 = google.maps.geometry.spherical.computeDistanceBetween (latLng3, latLng4);
    let dist3 = google.maps.geometry.spherical.computeDistanceBetween (latLng4, latLng5);
    let dist4 = google.maps.geometry.spherical.computeDistanceBetween (latLng5, latLng6);
    let dist5 = google.maps.geometry.spherical.computeDistanceBetween (latLng6, latLng7);
    let dist6 = google.maps.geometry.spherical.computeDistanceBetween (latLng7, latLng8);
    let dist7 = google.maps.geometry.spherical.computeDistanceBetween (latLng8, latLng9);
    let sum = dist0+dist1+dist2+dist3+dist4+dist5+dist6+dist7
    this.finalDist = (sum * 0.000621371).toPrecision(3)
    return this.finalDist
  }

  loadMap(lat, long, zoom){
    let options = { timeout: 10000, enableHighAccuracy: true };
    let latLng = new google.maps.LatLng(lat, long);
    let mapOptions = {
      center: latLng,
      zoom: zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    this.addMarker(latLng);
  }

  addMarker(coords, content) {
    let pin = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: coords
    });

    let info = content || '<h4>' + this.locName + '</h4><p>' + this.locAddress  + '</p>';
    this.addInfoWindow(pin, info);
  }

  addInfoWindow(marker, content){
    console.log(content);
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', function(){
      infoWindow.open(this.map, marker);
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
