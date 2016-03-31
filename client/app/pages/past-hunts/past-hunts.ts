import {Page, NavController, NavParams} from 'ionic-angular';
import {GoogleMapService} from '../../services/map/map-service';
import {TaskService} from '../../services/task/task-service';
import {ConnectionBackend, HTTP_PROVIDERS} from 'angular2/http';
import 'rxjs/add/operator/map';


@Page({
  templateUrl: 'build/pages/past-hunts/past-hunts.html',
  providers: [
    GoogleMapService,
    TaskService,
    ConnectionBackend,
    HTTP_PROVIDERS,
  ]
})
export class PastHuntsPage {
  map = null;
  previousPlaces: any;
  previousTasks: any;
  huntID: any;
  finalDist: any;
  previousHuntTasksAndLocations: any;
  error: any;
  huntTasks: any;
  huntChats: any;
  allPlaces: any;
  allTasks: any;
  totalDist: number;
  startLat: number;
  startLng: number;
  content: any;
  HUNT_URL: string = 'https://getsearchparty.com/singleHunt';


  constructor(private nav: NavController, navParams: NavParams, private googleMaps: GoogleMapService, private _taskService: TaskService) {
    this.huntID = navParams.get('huntID');
    // this.previousHuntTasksAndLocations = navParams.get('previousHuntTasksAndLocations');
    // console.log('this is the previousHuntTasksAndLocations ', this.previousHuntTasksAndLocations);
    // this.previousPlaces = this.previousHuntTasksAndLocations.map(hunt => hunt.place);
    // this.previousTasks = this.previousHuntTasksAndLocations.map(hunt => hunt.task);
    // console.log('this is the previous places mapped ', this.previousPlaces);
    // console.log('this is the previous tasks mapped ', this.previousTasks);
    // setTimeout(()=>{ 
    //   this.googleMaps.finalMapMaker(this.previousPlaces, this.previousTasks)
    //     .then(data => {
    //       console.log(data);
    //       let flightPath = data;
    //     }), 2000 });
    
    // this.finalDist = this.googleMaps.calcDistance(this.previousPlaces);
    this.allTasks = [];
    this.allPlaces = [];
    this.getHuntData();
  }

  getHuntData() {
    let dataObj = {
        huntID: this.huntID
    }
    this._taskService.postData(JSON.stringify(dataObj), this.HUNT_URL)
      .then(data => {
        console.log("promise returned")
        this.huntTasks = data.tasks;
        this.startLat = data.tasks[0].place.lat;
        this.startLng = data.tasks[0].place.lng;
        this.content = '<h4>' + data.tasks[0].place.name + ' < /h4><p>' + data.tasks[0].place.address + '</p > ';
        if (data.chatroom.messages.length > 0) {
          this.huntChats = data.chatroom.messages;
        }
        this.huntTasks.forEach((item) => {
          this.allPlaces.push(item.place);
          this.allTasks.push(item.task);
        })
        setTimeout(() => { this.showMap() }, 1000)
      })
      .catch(err => console.log(err));
  }

  showMap() {
    this.googleMaps.finalMapMaker(this.allPlaces, this.allTasks)
      .then(data => {
        let flightPath = data;
      });

    this.totalDist = this.googleMaps.calcDistance(this.allPlaces);
    console.log(this.totalDist)
  }
  
}
