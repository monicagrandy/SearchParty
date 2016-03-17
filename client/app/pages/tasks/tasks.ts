import {Page, NavController, NavParams, LocalStorage} from 'ionic-angular';
import {TaskService} from '../../services/task-service/task-service';
import {Http, Headers, ConnectionBackend, HTTP_PROVIDERS } from 'angular2/http';
import {LogIn} from '../users/log-in';
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
  selectedItem: any;
  locAddress: any;
  locChallenge: any;
  locLat: number;
  locLng: number;
  locName: any;
  completeToggle = false
  tasks: ['bar', 'restaurant', 'bar', 'restaurant']
  //maybe store all previous location names
  constructor(private nav: NavController, navParams: NavParams, private taskService: TaskService, private logIn: LogIn) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
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
        //add map
      }) 
   }

  //this should be triggered when the next button is pushed
  getNewTask(){
    navigator.geolocation.getCurrentPosition(position => {
      //access local storage from log-in
      this.logIn.local.set('userLat', position.coords.latitude)
      this.logIn.local.set('userLng', position.coords.longitude)     
      if(this.tasks.length > 0){
        let keyword = this.tasks.pop()
        //send the server a new keyword and the most recent geolocation of user
        let dataObj = {
          keyword: keyword,
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        this.taskService.postData(keyword)
          .then(result => {
          //this is the data we get back from the server  
          this.locName = result.name
          this.locAddress = result.address
          this.locChallenge = result.challenge
          this.locLat = result.lat
          this.locLng = result.lng
        })
      }
      else {
      //user has completed the hunt
      }
    })  
  }

  //use this to check if user is allowed to move on to the next task
  markComplete(){
    if(this.completeToggle === false){
      this.completeToggle = true
    }
    else {
      this.completeToggle = false
    }
    return this.completeToggle
  }
  
}
