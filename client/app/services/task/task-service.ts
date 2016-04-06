import {Injectable} from 'angular2/core';
import {Storage, LocalStorage} from 'ionic-angular';
import {APIService} from '../api/api-service';
import {NgZone} from 'angular2/core';
import {Camera} from 'ionic-native';

@Injectable()
export class TaskService {
  resendLocationTimeout = null;
  socket: any;
  huntID: string;
  username: string;
  userLat: string;
  userLong: string;
  local: Storage = new Storage(LocalStorage);
  SOCKET_URL: string = localStorage.socket || 'https://getsearchparty.com';
  imgData: any;
  image: any;
  
  constructor(private _apiService:APIService, private _zone: NgZone) {}
  
  postData(data, urlName) {
    return this._apiService.postData(data, urlName);
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
  
  takePic() {
    console.log('taking picture');
    let options = {
      destinationType: 0,
      sourceType: 1,
      encodingType: 0,
      targetWidth: 1024,
      targetHeight: 1024,
      quality:100,
      allowEdit: false,
      saveToPhotoAlbum: false
    };
    Camera.getPicture(options)
      .then((data) => {
        this.imgData = 'data:image/jpeg;base64,' + data;
        this._zone.run(() => this.image = this.imgData);

        let dataObj = {
          huntID: this.huntID
        };
        
        this.postData(dataObj, 'singleHunt')
          .then(entireHuntData => {
            let currentTaskNumber = entireHuntData.huntData.tasknumber;
            let dataObj = {
              count: currentTaskNumber,
              huntID: this.huntID,
              image: this.imgData
            };
            this.postData(dataObj, 'upload')
              .then(result => {
                console.log("image sent to server");
              })
                .catch(error => console.error(error));
            });
      }, (error) => {
        alert(error);
      });    
  }


}

