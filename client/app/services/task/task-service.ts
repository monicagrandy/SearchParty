import {Injectable} from 'angular2/core';
import {Storage, LocalStorage} from 'ionic-angular';
import {APIService} from '../api/api-service';
import {NgZone} from 'angular2/core';
import {Camera} from 'ionic-native';
import {GoogleMapService} from '../map/map-service';

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
  finalData: any;
  finalDist: any;
  previousPlaces: any;
  previousTasks: any;
  huntName: string;
  locLat: number;
  locLng: number;
  locName: string;
  currChallenge: string;
  locAddress: string;
  taskNumber: any;
  totalNumberOfTasks: any;
  
  
  constructor(
    private _apiService:APIService, 
    private _zone: NgZone,
    private _googleMaps:GoogleMapService
    ) {}
  
  postData(data, urlName) {
    return this._apiService.postData(data, urlName);
  }
  
  createSocket(huntID, username) {
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
      mediaType: 2,
      targetWidth: 1024,
      targetHeight: 1024,
      quality: 100,
      allowEdit: false,
      saveToPhotoAlbum: false
    };
    return Camera.getPicture(options)
      .then(data => {
        this.imgData = 'data:image/jpeg;base64,' + data;

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
            
        return this._zone.run(() => {
          return new Promise((resolve, reject) => {
            resolve(this.imgData);
            reject('error taking photo');
          });
        });
      }, (error) => {
        alert(error);
      });    
  }
  
  searchComplete(previousPlaces, previousTasks) {
    console.log(previousTasks);
    
    let dataObj = {
      huntID: this.huntID
    };
    
    return new Promise((resolve, reject) => {
      this.postData(dataObj, 'singleHunt')
        .then(result => {
          this.finalData = result.tasks;
          console.log("+++line 179 in tasks.js data: ", result);
       
          this.showMap(previousPlaces, previousTasks);

          if (previousPlaces.length > 1) {
            this.finalDist = this.calDist(previousPlaces);
            resolve({
              finalData: this.finalData,
              finalDist: this.finalDist
            });
            
            reject('error making search complete'); 
          }
          
          resolve({
            finalData: this.finalData,
            finalDist: this.finalDist
          });
          
          reject('error making search complete');    
        });
    
    });
  }
  
  getNewTask(keyword, previousPlaces, previousTasks, locLat, locLng, huntName) {
    let dataObj = {
      previousPlaces: this.previousPlaces = previousPlaces,
      previousTasks: this.previousTasks = previousTasks,
      keyword: keyword,
      token: localStorage.id_token,
      huntID: this.huntID,
      geolocation: {
        lat: this.locLat = locLat,
        lng: this.locLng = locLng
      },
      huntName: this.huntName = huntName
    };

    return this.postData(dataObj, 'tasks')
      .then(result => {
         return this._zone.run(() => {
           this.previousPlaces.push(result.businesses);
           this.previousTasks.push(result.tasks);
           let data = {
             locName: this.locName = result.businesses.name,
             currChallenge: this.currChallenge = result.tasks.content,
             previousPlaces: this.previousPlaces,
             locAddress: this.locAddress = result.businesses.location.display_address[0] + ', ' + result.businesses.location.display_address[2],
             previousTasks: this.previousTasks,
             locLat: this.locLat = result.businesses.location.coordinate.latitude,
             locLng: this.locLng = result.businesses.location.coordinate.longitude,
             taskNumber: this.taskNumber = result.taskNumber,
             totalNumberOfTasks: this.totalNumberOfTasks = result.totalNumberOfTasks        
           };
           let content = '<h4>' + this.locName + '</h4><p>' + this.locAddress  + '</p>';
           this._googleMaps.loadMap(this.locLat, this.locLng, 15, content);
           this.refreshFeed(this.locName, this.currChallenge, this.huntID, this.locLat, this.locLng, 15);
           return new Promise((resolve, reject) => {
             resolve(data);
             reject('error getting new task');
           });        
        })
      });
  }
  
  showMap(previousPlaces, previousTasks) {
    this._googleMaps.finalMapMaker(previousPlaces, previousTasks)
      .then(data => {
        let flightPath = data;
      });
  }
  
  calDist(previousPlaces) {
    return this._googleMaps.calcDistance(previousPlaces);
  }

}

