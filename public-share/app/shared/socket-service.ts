import {Injectable} from 'angular2/core';
import {SearchPartyService} from '../feed/searchparty-service';
import {GoogleMapService} from '../map/map-service';


@Injectable()
export class SocketService {
  socket: any;
  SOCKET_URL: string = localStorage.socket || 'https://getsearchparty.com';
  huntID: string;
  
  constructor(
    private _searchPartyService:SearchPartyService,
    private _googleMaps:GoogleMapService
    ) {}
  
  createSocket(huntID) {
    this.socket = io.connect(this.SOCKET_URL);
    this.huntID = huntID;
    this.socket.on("connect", () => {
      this.socket.emit('huntMapRoom', this.huntID);
    });
    this.updateTask();
    this.updateLocation();
  }
  
  updateTask() {
    this.socket.on('taskChange', (location, task, room, lat, lng, num) => {
      console.log(' this is the task change location change ', location);
      this.socket.emit('chat_message', 'challenge completed!', 'Party Bot', Date.now()/1000, this.huntID);
      console.log('task change socket is calling the searchParty Service to update the feed!');
      this._searchPartyService.getHunt(this.huntID);
    });
  }
  
  updateLocation() {
    this.socket.on("location", (data, username) => {
      let coords = new google.maps.LatLng(data.latitude, data.longitude);
      setTimeout(() => this._googleMaps.addCurrentMarker(coords, `${username}'s location`)
        .then(map => `map updated with ${username}'s location!`), 2000);
      console.log('location was updated from socket server ', data, username);
    });
  }
}
    