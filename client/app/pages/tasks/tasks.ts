import {Page, NavController, NavParams, LocalStorage} from 'ionic-angular';
import {TaskService} from '../../services/task-service/task-service';
import {Http, Headers, ConnectionBackend, HTTP_PROVIDERS } from 'angular2/http';
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
  map = null;
  local: LocalStorage
  selectedItem: any; 
  locAddress = '1240 3rd Street Promenade, Santa Monica, CA 90401'; //set this to whatever is in local storage
  currChallenge = 'Buy a stranger a shot';
  //locChallenge = "Buy a stranger a shot"; //set this to whatever is in local storage
  locLat = 34.0173550 //set this to whatever is in local storage
  locLng = -118.4984360 //set this to whatever is in local storage
  locName = "Cabo Cantina" //set this to whatever is in local storage
  completeToggle = false
  tasks = ['bars', 'dive-bars', 'sports-bars', 'lounge', 'fast-food']
  previousPlaces = []
  constructor(private nav: NavController, navParams: NavParams, private taskService: TaskService) {
    // If we navigated to this page, we will have an item available as a nav param
    //this.map = null;
    this.selectedItem = navParams.get('item');
    console.log(this.locLat, this.locLng)
    setTimeout(()=>{ this.loadMap(this.locLat, this.locLng), 1000 })
  }

  //this should be triggered when the next button is pushed
  getNewTask(){
    console.log("getting ready to send new task!")
      //move this down to success callback later
      //this.logIn.local.set('userLng', position.coords.longitude)
      console.log(this.tasks)     
      if(this.tasks.length > 0){
        let keyword = this.tasks.shift()
        // console.log(this.tasks)
        // this.locName = "Britania Pub";
        // this.locAddress = "318 Santa Monica Blvd, Santa Monica, CA 90401";
        // this.currChallenge = "Do a car bomb!"
        // this.locLat = 34.015914;
        // this.locLng = -118.4953900;
        // this.markComplete();
        // this.loadMap(this.locLat, this.locLng);
        // console.log(keyword)
        //send the server a new keyword and the most recent geolocation of user
        let dataObj = {
          previousPlaces: this.previousPlaces,
          keyword: keyword,
          lat: this.locLat,
          lng: this.locLng
        }
        this.taskService.postData(dataObj)
          console.log("inside taskService.postData")
          .then(result => {
            console.log(result)
          //this is the data we get back from the server  
          this.locName = result.businesses.name;
          this.previousPlaces.push(this.locName)
          this.locAddress = result.businesses.location.address;
          this.currChallenge = result.tasks.content
          this.locLat = result.businesses.coordinate.latitude;
          this.locLng = result.businesses.coordinate.latitude;
          this.markComplete();
          this.loadMap(this.locLat, this.locLng);
        })
      }
      else {
        console.log("no more tasks!")
    } 
  }

  loadMap(lat, long){
    let options = { timeout: 10000, enableHighAccuracy: true }
    let latLng = new google.maps.LatLng(lat, long);
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
    let info = '<h4>' + this.locName + '</h4><p>' + this.locAddress + '</p>'
      
    this.addInfoWindow(pin, info)  
  }  

  addInfoWindow(marker, content){
    console.log("marker : ", marker);
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
