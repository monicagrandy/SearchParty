import {Component, OnInit} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteParams} from 'angular2/router';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS} from 'ng2-material/all';
import {SearchPartyService} from './searchparty.service';
import {GoogleMapService} from './map.service';
import 'rxjs/add/operator/map';
import * as _ from 'underscore';

@Component({
  selector: 'my-searchparty',
  templateUrl: './share/app/searchparty.component.html',
  styleUrls: ['./share/app/searchparty.component.css'],
  directives: [ROUTER_DIRECTIVES, MATERIAL_DIRECTIVES],
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
  //content: any;
  
  constructor(private _params: RouteParams, private googleMaps: GoogleMapService, private _searchPartyService: SearchPartyService) {
    this.huntID = _params.get('huntID');
    this.allTasks = []
    this.allPlaces = []
    this._searchPartyService.getHunt(this.huntID)
      .then(data => {
        console.log("data received")
        this.huntTasks = data.tasks;
        this.startLat = data.tasks[0].place.lat;
        this.startLng = data.tasks[0].place.lng;
        //console.log(this.startLat)
        //console.log(this.startLng)
        let content = '<h4>' + data.tasks[0].place.name + ' < /h4><p>' + data.tasks[0].place.address+ '</p > ';
        //console.log(content)
        this.huntChats = data.chats.messages;
        // this.huntTasks.forEach((item) => {
        //   this.allTasks.push(item.place);
        //   this.allTasks.push(item.task);
        // })
        this.googleMaps.loadMap(this.startLat, this.startLng, 15, content, this.map).then(map => this.map = map)
        //this.showMap()
      })
      .catch(err => console.log(err));
  }     
    
  showMap() {
    this.googleMaps.finalMapMaker(this.allPlaces, this.allTasks)
        .then(data => {
          let flightPath = data;
        });

      this.totalDist = this.googleMaps.calcDistance(this.allPlaces);
    }

}
