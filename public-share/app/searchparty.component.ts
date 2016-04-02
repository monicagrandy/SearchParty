import {Component, OnInit} from 'angular2/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteParams} from 'angular2/router';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS} from 'ng2-material/all';
import {SearchPartyService} from './searchparty.service';
import {GoogleMapService} from './map.service';
import {ChatComponent} from './chat.component';


@Component({
  selector: 'my-searchparty',
  templateUrl: './share/app/searchparty.component.html',
  styleUrls: ['./share/app/searchparty.component.css'],
  directives: [ROUTER_DIRECTIVES, MATERIAL_DIRECTIVES, ChatComponent],
  providers: [MATERIAL_PROVIDERS, SearchPartyService, GoogleMapService]
})
export class SearchPartyComponent {
  items: string[] = ['item1', 'item2', 'item3'];
  modalSelected: string;
  selected: string;
  animationsEnabled: boolean = true;
  map = null;
  huntID: any;
  error: any;
  huntTasks: any;
  huntChats: any;
  allPlaces: any;
  allTasks: any;
  totalDist: number;
  startLat: number;
  startLng: number;
  content: any;
  socket: any;
  tasks: any;
  io: any;
  chatroom: any;

  constructor(private _params: RouteParams, private googleMaps: GoogleMapService, private _searchPartyService: SearchPartyService) {
    this.huntID = _params.get('huntID');
    this.allTasks = [];
    this.getHuntData(this.huntID);
    let socket = io.connect('http://localhost:8000');
    this.socket = socket;
    this.socket.on("connect", () => {
      this.socket.emit('huntMapRoom', this.huntID);
    });
    this.socket.on('taskChange', (location, task, room, lat, lng, num) => {
      console.log('{{}{}}{}{}}{} recieving taskChange {}{}{}{}');
      console.log(' this is the task change location change ', location);
      this.allTasks.unshift([[location], [task]]);
      this.socket.emit('chat_message', '::TASK HAS CHANGED::', 'SearchPartyAdmin', null, this.huntID);
      this.socket.emit('chat_message', 'challenge completed!', 'Party Bot', Date.now()/1000, this.huntID);
      this.getHuntData(this.huntID);
   });
   this.socket.on("location", (data, username) => {
     let coords = new google.maps.LatLng(data.latitude, data.longitude);
     this.googleMaps.addCurrentMarker(coords, 'user location', this.map)
       .then(map => this.map = map);
     console.log('location was updated from socket server ', data, username);
   });
 }

 getHuntData(id){
   let previousPlaces = [];
   let previousTasks = [];
   this.allTasks = [];
   this._searchPartyService.getHunt(id)
    .then(data => {
      console.log("data from searchparty service ", data);
      this.huntTasks = data.tasks;
      this.startLat = data.tasks[0].place.lat;
      this.startLng = data.tasks[0].place.lng;
      this.content = '<h4>' + data.tasks[0].place.name + ' < /h4><p>' + data.tasks[0].place.address + '</p > ';
      console.log('data.chatroom.messages:::', data.chatroom.messages);
      if(data.chatroom.messages){
        this.huntChats = data.chatroom.messages;
      }
      this.huntTasks.forEach((item) => {
         console.log(' this is the item ', item);
         console.log('this is the this.alltasks ', this.allTasks);
         this.allTasks.unshift([[item.place.name], [item.task.content]]);
         previousPlaces.push(item.place);
         previousTasks.push(item.task);
      });
      setTimeout(() => {
        this.googleMaps.finalMapMaker(previousPlaces, previousTasks)
            .then(data => {
              let flightPath = data;
            });
            
        if (previousPlaces.length > 1) {
          this.totalDist = this.googleMaps.calcDistance(previousPlaces);
          console.log(this.totalDist);
        }    
      }, 2000);

    })
      .catch(err => console.log(err));
  }

}
