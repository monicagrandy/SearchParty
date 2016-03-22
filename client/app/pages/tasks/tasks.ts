import {Page, NavController, NavParams, LocalStorage} from 'ionic-angular';
import {TaskService} from '../../services/task-service/task-service';
import { ConnectionBackend, HTTP_PROVIDERS } from 'angular2/http';
import {JwtHelper} from 'angular2-jwt';
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
  keywords = ['Bar', 'Bar', 'Bar', 'Bar', 'Bar', 'Bar','Bar','Bar', 'Bar', 'Bar'];
  tasksLeft: any;
  endHunt: boolean;
  startTime: any;
  endTime: any;
  user: string;
  jwtHelper: JwtHelper = new JwtHelper();
  token: any;
  previousPlaces: any;
  previousTasks: any;
  
  constructor(private nav: NavController, navParams: NavParams, private _taskService: TaskService) {
    // If we navigated to this page, we will have an item available as a nav param
    //this.map = null;
    this.tasksLeft = true
    console.log(localStorage.id_token)
    this.token = localStorage.id_token
    if(this.token) {
      this.user = this.jwtHelper.decodeToken(this.token).username;
    }
    this.locAddress = navParams.get('locAddress');
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
    let mapId = 'map'
    console.log('getting ready to send new task!')
      //move this down to success callback later
      //this.logIn.local.set('userLng', position.coords.longitude)
      console.log(this.keywords)     
      if(this.keywords.length > 0){
        let keyword = this.keywords.shift()
        let dataObj = {
          previousPlaces: this.previousPlaces,
          previousTasks: this.previousTasks,
          keyword: keyword,
          geolocation: {
            lat: this.locLat,
            lng: this.locLng
          }
        }
        this._taskService.postData(JSON.stringify(dataObj))
          .then(result => { 
            this.locName = result.businesses.name;
            this.currChallenge = result.tasks.content
            this.previousPlaces.push(result.businesses)
            this.locAddress = result.businesses.location.display_address[0] + ', ' + result.businesses.location.display_address[2];
            this.previousTasks.push(result.tasks)
            this.locLat = result.businesses.location.coordinate.latitude;
            this.locLng = result.businesses.location.coordinate.longitude;
            this.markComplete();
            this.loadMap(this.locLat, this.locLng, 15);
          })
        }
      else {
        console.log('no more tasks!')
        console.log(this.previousTasks)
        console.log(this.previousPlaces)
        this.searchComplete();
        this.tasksLeft = false;
    } 
  }

  searchComplete(){
    this.endTime = new Date().toLocaleTimeString()
    this.startTime = localStorage.startTime
    let finalLat = this.previousPlaces[10].location.coordinate.latitude
    let finalLng = this.previousPlaces[10].location.coordinate.longitude
    this.loadMap(finalLat, finalLng, 12)
    let points = []
    for(let i = 0; i < this.previousPlaces.length; i++){
      let currLat = this.previousPlaces[i].location.coordinate.latitude
      let currLng = this.previousPlaces[i].location.coordinate.longitude
      let name = this.previousPlaces[i].name
      let currChallenge = this.previousTasks[i].content
      console.log(currChallenge)
      let currPos = new google.maps.LatLng(currLat, currLng);
      let info = '<h4>' + currChallenge + '</h4><p>' + name  + '</p>'
      points.push(new google.maps.LatLng(currLat, currLng))
      this.addMarker(currPos, info);
    }
    let flightPath = new google.maps.Polyline({
      map: this.map,  
      path: points,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
  }
 
  loadMap(lat, long, zoom){
    let options = { timeout: 10000, enableHighAccuracy: true }
    let latLng = new google.maps.LatLng(lat, long);
    let mapOptions = {
      center: latLng,
      zoom: zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(document.getElementById('map'), mapOptions)
    this.addMarker(latLng)
    }

  addMarker(coords, content) {  
    let pin = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: coords
    });
    let info = content || '<h4>' + this.locName + '</h4><p>' + this.locAddress  + '</p>'
    this.addInfoWindow(pin, info)
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
    console.log(this.completeToggle)
    if(this.completeToggle === false){
      this.completeToggle = true
    }
    else {
      this.completeToggle = false
    }
    return this.completeToggle
  }
  
}
