import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import 'rxjs/add/operator/map';  // we need to import this now

@Injectable()
export class TaskService {
  resendLocationTimeout = null;
  userInfo: any;
  socket: any;
  huntID: string;
  username: string;
  
  constructor(private _http:Http) {}
  contentHeader: Headers = new Headers({'Content-Type': 'application/json'});
  
  postData(data, url) {
    console.log("called post req");

    let httpPromise = new Promise((resolve, reject) => {
      console.log(data);
      this._http.post(url, data, { headers: this.contentHeader })
        .map(res => res.json())
        .subscribe(
        data => {
          console.log("data from promise: ", data);
          resolve(data);
        },
        err => reject(err),
        () => console.log('data recieved')
        )
    })

    return httpPromise;
  }
  
  createSocket(huntID, username) {
    let socket = io.connect('http://localhost:8000');
    this.huntID = huntID;
    this.username = username;
    this.socket.on("connect", () => {
      this.socket.emit('huntChatRoom', this.huntID);
    });
  }
  
  updateSocketLocation() {
    this.socket.on("location", (data, username) => {
      console.log('location was updated from socket server ', data, username);
    });
  }
  
  createWatchLocation() {
    let geo_options = { enableHighAccuracy: true };
    navigator.geolocation.watchPosition(this.geo_success, this.geo_error, geo_options);
    navigator.geolocation.getCurrentPosition(this.geo_success, this.geo_error, geo_options);
  }
  
  geo_success(position) {
    this.userInfo.latitude  = position.coords.latitude;
    this.userInfo.longitude = position.coords.longitude;
    console.log('geo success here is the user location ', this.userInfo);
    this.resendLocation();
  }

  geo_error(error) {
    console.log('there was a geo egrror ', error);
  }

  resendLocation(){
    this.socket.emit('location', this.userInfo, this.username, this.huntID);
    clearTimeout(this.resendLocationTimeout);
    this.resendLocationTimeout = setTimeout(this.resendLocation, 1000*5);
  }

}

