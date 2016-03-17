import {Page, NavController, NavParams, LocalStorage} from 'ionic-angular';
//import {Geolocation} from 'ionic-framework/ionic';
import {TaskService} from '../../services/task-service/task-service';
import {Http, Headers, ConnectionBackend, HTTP_PROVIDERS } from 'angular2/http';
//import {LogIn} from '../users/log-in';
import 'rxjs/add/operator/map';


@Page({
  templateUrl: 'build/pages/tasks/tasks.html',
  providers: [
    ConnectionBackend,
    HTTP_PROVIDERS,
    TaskService,
    //LogIn
  ]
})

export class TaskPage {
  title = 'Current Task'
  map = null
  selectedItem: any;
  locAddress: any;
  locChallenge: any;
  locLat: number;
  locLng: number;
  locName: any;
  completeToggle = false
  tasks = ['bar', 'restaurant', 'bar', 'restaurant']
  //maybe store all previous location names
  constructor(private nav: NavController, navParams: NavParams, private taskService: TaskService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.loadMap();
  }

  //store location address
  //store location map
  //store challenge

  //this should be triggered on when a template is submitted and whenever the next button is pushed
  showTask(){
    this.taskService.getData()
      .then(result => {
        this.locAddress = result.address
        this.locChallenge = result.challenge
        this.locName = result.name
        this.locLat = result.lat
        this.locLng = result.lng
        //add map
      }) 
   }

  //this should be triggered when the next button is pushed
  getNewTask(){
    console.log("getting ready to send new task!")
      //this.logIn.local.set('userLng', position.coords.longitude)
      console.log(this.tasks)     
      if(this.tasks.length > 0){
        let keyword = this.tasks.pop()
        console.log(keyword)
        //send the server a new keyword and the most recent geolocation of user
        let dataObj = {
          name: this.locName,
          keyword: keyword,
          lat: this.locLat,
          lng: this.locLng
        }
        this.taskService.postData(keyword)
          .then(result => {
          //this is the data we get back from the server  
          this.locName = result.name;
          this.locAddress = result.address;
          this.locChallenge = result.challenge;
          this.locLat = result.lat;
          this.locLng = result.lng;
          this.markComplete();
          this.loadMap();
        })
      }
      else {
        console.log("no more tasks!")
    } 
  }

  loadMap(){
    navigator.geolocation.getCurrentPosition(position => {
      //access local storage from log-in
      this.locLat = position.coords.latitude
      this.locLng = position.coords.longitude
      let options = { timeout: 10000, enableHighAccuracy: true}
      let latLng = new google.maps.LatLng(this.locLat, this.locLng);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(document.getElementById('map'), mapOptions)
      let pin = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: latLng
      });
      let info = `
          <h4>Location Name</h4>
          <p>Location Address</p>
        `
      this.addInfoWindow(pin, info)  
    })
  }

  addInfoWindow(marker, content){
    console.log('addInfoWindow is called! ', marker, content);

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
