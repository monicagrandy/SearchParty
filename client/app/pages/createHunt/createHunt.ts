import {Page, NavController, NavParams, LocalStorage, Storage} from 'ionic-angular';
import {TaskPage} from '../tasks/tasks';
import {TemplateService} from '../../services/template/template-service';
import {FORM_DIRECTIVES} from 'angular2/common';

@Page({
  templateUrl: 'build/pages/createHunt/createHunt.html',
  providers: [
    TemplateService
  ],
  directives: [FORM_DIRECTIVES]
})
export class CreateHuntPage {
  local: Storage = new Storage(LocalStorage);
  userLng: number;
  userLat: number;
  userInfo: {};
  geolocation: {};
  data: any;
  businesses: any;
  tasks: any;
  huntID: any;
  selectedItem: any;
  taskNumber: number;
  name: string;
  requiredInfo: boolean;
  keyword: string;
  keywordsArray = [];
  template: any;

  constructor(private nav: NavController, navParams: NavParams, private templateService: TemplateService) {
    this.template = navParams.get('templateName');
    this.keywordsArray = navParams.get('keywordsArray');
    this.taskNumber;
    this.name;
    this.requiredInfo = false;
    if (localStorage.userLat && localStorage.userLng) {
      this.userLat = localStorage.userLat;
      this.userLng = localStorage.userLng;
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition((position => {
          this.userLat = position.coords.latitude;
          this.userLng = position.coords.longitude;
          this.local.set('userLat', position.coords.latitude);
          this.local.set('userLng', position.coords.longitude);
        }), (error => console.error(error)), {});
      }
    }
  }
  
  nameHunt() {
    if (this.name && this.taskNumber) {
        this.itemTapped(this.name, this.taskNumber);
    } else {
        this.requiredInfo = true;
    }
  }

  itemTapped(name, taskNumber) {
    console.log('sending hunt creation info to server...', name);
    this.userInfo = localStorage;
    localStorage.startTimeUnix = Date.now();
    localStorage.startTime = new Date().toLocaleTimeString();
    this.taskNumber = taskNumber;
    this.keywordsArray.splice(this.taskNumber, this.keywordsArray.length);
    console.log('this is the keywordsArray after splicing ', this.keywordsArray);
      
    let currentTime = new Date();
      
    let dataToSend = {
      keyword: this.keywordsArray[0].name,
      geolocation:  {
        lat: this.userInfo.userLat,
        lng: this.userInfo.userLng
       },
      huntName: name,
      token: this.userInfo.id_token,
      previousPlaces: [],
      previousTasks: [],
      date: currentTime,
      templateName: this.template,
      taskNumber: this.taskNumber
    };
     
    this.templateService.postData(dataToSend, 'tasks')
      .then(data => {
        this.nav.setRoot(TaskPage, {
          locAddress: data.businesses.location.display_address[0] + ', ' + data.businesses.location.display_address[2],
          huntID: data.huntID,
          taskNumber: data.taskNumber,
          huntName: data.huntName,
          currChallenge: data.tasks.content,
          locLat: data.businesses.location.coordinate.latitude,
          locLng: data.businesses.location.coordinate.longitude,
          locName: data.businesses.name,
          previousPlaces: [data.businesses],
          previousTasks: [data.tasks],
          keywordsArray: this.keywordsArray,
          totalNumberOfTasks: data.totalNumberOfTasks
       });
     })
       .catch(error => console.error(error));
  }
}
