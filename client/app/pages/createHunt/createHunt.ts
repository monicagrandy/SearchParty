import {Page, NavController, NavParams, LocalStorage, Storage} from 'ionic-angular';
import {TaskPage} from '../tasks/tasks';
import {TemplateService} from '../../services/template/template-service';

@Page({
  templateUrl: 'build/pages/templates/templates.html',
  providers: [TemplateService]
})
export class TemplatePage {
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

  constructor(private nav: NavController, navParams: NavParams, private templateService: TemplateService) {
    this.selectedItem = navParams.get('item');
}
   itemTapped(event, item) {
     console.log('sending item.type... ', item);
     this.userInfo = localStorage;
     localStorage.startTimeUnix = Date.now();
     localStorage.startTime = new Date().toLocaleTimeString()
     console.log('sending userInfo... ', this.userInfo);
     this.templateService.postData(item.title, this.userInfo)
       .then(data => {
        this.nav.setRoot(TaskPage, {
           locAddress: data.businesses.location.display_address[0] + ', ' + data.businesses.location.display_address[2],
           huntID: data.huntID,
           currChallenge: data.tasks.content,
           locLat: data.businesses.location.coordinate.latitude,
           locLng: data.businesses.location.coordinate.longitude,
           locName: data.businesses.name,
           previousPlaces: [data.businesses],
           previousTasks: [data.tasks]
        });
       })
        .catch(error => console.error(error));
   }
}
