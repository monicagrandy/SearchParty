import {Component, OnInit} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteParams} from 'angular2/router';
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
  chatroom: any;

  constructor(private _params: RouteParams, private googleMaps: GoogleMapService, private _searchPartyService: SearchPartyService) {
    this.huntID = _params.get('huntID');
    this.allTasks = []
    this.allPlaces = []
    this.getHuntData(this.huntID);
    let socket = io.connect('http://localhost:8000');
    this.socket = socket;
    this.socket.on("connect", () => {
      this.socket.emit('huntChatRoom', this.huntID);
    });
    this.socket.on('taskChange', (location, task, room, lat, lng, num) => {
      console.log('{{}{}}{}{}}{} recieving taskChange {}{}{}{}');
      this.allTasks.push(task);
      this.allPlaces.push(location);
      this.socket.emit('chat_message', '::TASK HAS CHANGED::', 'SearchPartyAdmin', null, this.huntID);
      this.showMap();
   });

}

 getHuntData(id){
   this._searchPartyService.getHunt(id)
    .then(data => {
      //console.log("promise returned")
      this.huntTasks = data.tasks;
      this.startLat = data.tasks[0].place.lat;
      this.startLng = data.tasks[0].place.lng;
      this.content = '<h4>' + data.tasks[0].place.name + ' < /h4><p>' + data.tasks[0].place.address + '</p > ';
      if(data.chatroom.messages.length > 0){
        this.huntChats = data.chatroom.messages;
      }
      this.huntTasks.forEach((item) => {
        this.allPlaces.push(item.place);
        this.allTasks.push(item.task);
      })
      console.log("hello")
      console.log(this.allTasks)
      console.log(this.allPlaces)
      this.showMap()
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
