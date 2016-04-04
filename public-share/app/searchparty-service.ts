import {Injectable, Output, Input, EventEmitter} from 'angular2/core';
import {APIService} from './api-service';
import {GoogleMapService} from './map-service';
import 'rxjs/add/operator/map';

@Injectable()
export class SearchPartyService {
  huntTasks = [];
  content: any;
  huntChats: any;
  allTasks = [];
  previousPlaces = [];
  previousTasks = [];
  totalDist: any;
  
  @Output() taskChange = new EventEmitter();
  @Output() totalDistChange = new EventEmitter(); 
  
  constructor(
    private _apiService:APIService,
    private _googleMaps:GoogleMapService
    ) {}

  getHunt(huntID) {
    let dataToSend = { huntID: huntID };
    this._apiService.getData(dataToSend, 'singleHunt')
      .then(data => {
        this.updateFeed(data);
      })
  }
  
  updateFeed(data) {
    this.huntTasks = data.tasks;
    this.content = 
      '<h4>' + data.tasks[0].place.name + ' < /h4><p>' + 
      data.tasks[0].place.address + '</p > ';
    
    if (data.chatroom.messages) {
      this.huntChats = data.chatroom.messages;
    }
    
    this.huntTasks.forEach(item => {
      this.allTasks.unshift([[item.place.name], [item.task.content]]);
      this.previousPlaces.push(item.place);
      this.previousTasks.push(item.task);
    });
    
    this.updateMap();
    console.log('this is the huntTasks to be emitted ', this.allTasks);
    this.taskChange.emit(this.allTasks);
  }
  
  updateMap() {
    setTimeout(() => {
      this._googleMaps.finalMapMaker(this.previousPlaces, this.previousTasks)
          .then(data => {
            let flightPath = data;
          });

      if (this.previousPlaces.length > 1) {
        this.totalDist = this._googleMaps.calcDistance(this.previousPlaces);
        console.log('total dist to be emitted ', this.totalDist);
        this.totalDistChange.emit(this.totalDist);
      }
    }, 2000);    
  }  
}  