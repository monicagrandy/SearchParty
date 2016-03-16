import {Page, NavController, NavParams} from 'ionic-angular';
import {TaskService} from '../../services/task-service/task-service';
import {Http, Headers, ConnectionBackend, HTTP_PROVIDERS } from 'angular2/http';
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
  locChallenge: any
  locName: any;
  completeToggle = false
  tasks: ['bar', 'restaurant', 'bar', 'restaurant']
  //maybe store all previous location names
  constructor(private nav: NavController, navParams: NavParams, private taskService: TaskService) {
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
        //add map
      }) 
   }

  //this should be triggered when the next button is pushed
  getNewTask(){
    //check if the mark complete button is checked
    if(this.tasks.length > 0){
      let keyword = this.tasks.pop()
      this.taskService.postData(keyword)
        .then(result => {
          this.name = result.name
          this.locAddress = result.address
          this.locChallenge = result.challenge
        })
      }
    else {
      //user has completed the hunt
    }  
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
