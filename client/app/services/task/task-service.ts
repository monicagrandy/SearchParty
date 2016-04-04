import {Injectable} from 'angular2/core';
import {Storage, LocalStorage} from 'ionic-angular';
import {Http, Headers} from 'angular2/http';
import {UrlService} from '../url/url-service';
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
  HUNT_URL: string = localStorage.singleHunt || 'https://getsearchparty.com/singleHunt';
  TASKS_URL: string = localStorage.tasks || 'https://getsearchparty.com/tasks';
  FEEDBACK_URL: string = localStorage.feedback || 'https://getsearchparty.com/feedback';
  UPLOAD_URL: string = localStorage.upload || 'https://getsearchparty.com/upload';
  SOCKET_URL: string = localStorage.socket || 'https://getsearchparty.com';
  urls: {
    hunt: string;
    tasks: string;
    upload: string;
    feedback: string;
  };
  
  constructor(private _http:Http) {}
  
  postData(data, url) {
    
    this.urls = {
      hunt: this.HUNT_URL,
      tasks: this.TASKS_URL, 
      upload: this.UPLOAD_URL,
      feedback: this.FEEDBACK_URL
    };
    
    console.log("called post req");
    
    console.log('this is the url passed in ', url);
    
    let urlLookup = this.urls[url];
    
    console.log(urlLookup);

    let httpPromise = new Promise((resolve, reject) => {
      console.log(data);
      this._http.post(urlLookup, data, { headers: this.contentHeader })
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
    this.socket = io.connect(this.SOCKET_URL);
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
      console.log('location was updated from socket server ', data, username);
    });
  }
  
  createWatchLocation() {
    let geo_success = position => {
      this.local.set('userLat', position.coords.latitude);
      this.local.set('userLng', position.coords.longitude);
      console.log('geo success here is the user location ', localStorage.userLat, localStorage.userLng);
      this.resendLocation();
    };
    let geo_error = error => console.log('there was a geo error ', error);
    let geo_options = { enableHighAccuracy: true };
    navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);
    navigator.geolocation.getCurrentPosition(geo_success, geo_error, geo_options);
  }
  
  resendLocation() {
    let userLocation = { latitude: localStorage.userLat, longitude: localStorage.userLng };
    this.socket.emit('location', userLocation, this.username, this.huntID);
    clearTimeout(this.resendLocationTimeout);
    this.resendLocationTimeout = setTimeout(() => this.resendLocation(), 1000*5);
  }
  
  refreshFeed(name, task, room, lat, lng, zoom) {
    this.socket.emit('taskChange', name, task, room, lat, lng, zoom);
    console.log('::::EMITTED SOCKET:::::');
  }

}

