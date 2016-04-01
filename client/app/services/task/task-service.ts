import {Injectable} from 'angular2/core';
import {Storage, LocalStorage} from 'ionic-angular';
import {Http, Headers} from 'angular2/http';
import 'rxjs/add/operator/map'; 

@Injectable()
export class TaskService {
  resendLocationTimeout = null;
  userInfo = null;
  socket: any;
  huntID: string;
  username: string;
  userLat: string;
  userLong: string;
  local: Storage = new Storage(LocalStorage);
  contentHeader: Headers = new Headers({'Content-Type': 'application/json'});
  
  constructor(private _http:Http) {}
  
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
    // update url later
    console.log('create socket is called ', huntID, username)
    this.socket = io.connect('http://localhost:8000');
    this.huntID = huntID;
    this.username = username;
    console.log('creating socket');
    this.socket.on("connect", () => {
      console.log('socket emitted');
      this.socket.emit('huntMapRoom', this.huntID);
    });
  }
  
  updateSocketLocation() {
    this.socket.on("location", (data, username) => {
      // update map which reflected changes
      console.log('location was updated from socket server ', data, username);
    });
  }
  
  createWatchLocation() {
    let geo_success = position => {
      console.log('geo success this is the position ', position);
      this.local.set('userLat', position.coords.latitude);
      this.local.set('userLng', position.coords.longitude);
      console.log('geo success here is the user location ', localStorage.userLat, localStorage.userLng);
      console.log(' I AM WATCHING YOUR LOCATION ');
      this.resendLocation();
    }
    let geo_error = error =>  console.log('there was a geo error ', error);
    let geo_options = { enableHighAccuracy: true };
    navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);
    navigator.geolocation.getCurrentPosition(geo_success, geo_error, geo_options);
  }
  
  // geo_success(position) {
  //   console.log('geo success this is the position ', position);
  //   this.local.set('userLat', position.coords.latitude);
  //   this.local.set('userLng', position.coords.longitude);
  //   this.userLat = localStorage.userLat;
  //   this.userLong = localStorage.userLng;
  //   console.log('geo success here is the user location ', this.userLat, this.userLong);
  //   console.log(' I AM WATCHING YOUR LOCATION ');
  //   this.resendLocation();
  // }

  // geo_error(error) {
  //   console.log('there was a geo egrror ', error);
  // }

  resendLocation(){
    console.log(' I JUST SENT YOUR LOCATION TO THE SERVER ');
    let userInfo = { latitude: localStorage.userLat, longitude: localStorage.userLng};
    this.socket.emit('location', userInfo, this.username, this.huntID);
    clearTimeout(this.resendLocationTimeout);
    this.resendLocationTimeout = setTimeout(() =>{ this.resendLocation()}, 1000*5);
  }

}

