import {Page, NavController, NavParams, LocalStorage, Storage} from 'ionic-angular';
import {TaskPage} from '../tasks/tasks';
import {CreateHuntPage} from '../createHunt/createHunt';
import {TemplateService} from '../../services/template/template-service';

@Page({
  templateUrl: 'build/pages/templates/templates.html',
  providers: [TemplateService]
})
export class TemplatePage {
  selectedItem: any;
  testData: Array<{type: string, huntname: string, image: string, icon: string}>;
  items: Array<{title: string, image: string, huntname: string, icon: string}>;
  local: Storage = new Storage(LocalStorage);
  loadComplete: boolean;
  loadingImg: any;
  userLng: number;
  userLat: number;
  userInfo: {};
  geolocation: {};

  constructor(private nav: NavController, navParams: NavParams, private templateService: TemplateService) {
    this.selectedItem = navParams.get('item');

    this.loadingImg = 'img/poi.gif';

    if (localStorage.userLat && localStorage.userLng) {
      this.userLat = localStorage.userLat;
      this.userLng = localStorage.userLng;
    } else {
      if (navigator.geolocation) {
        console.log("getting geolocation")
        navigator.geolocation.watchPosition((position => {
          this.userLat = position.coords.latitude;
          this.userLng = position.coords.longitude;
          this.local.set('userLat', position.coords.latitude);
          this.local.set('userLng', position.coords.longitude);
        }), (error => console.error(error)), {});
      }
    }

    this.testData = [
      {type: 'Bar', huntname: 'Bar Hunt', image: 'img/bar.jpg', icon: 'ios-pint'},
      {type: 'Beach', huntname: 'Beach Hunt', image: 'img/beach.jpg', icon: 'ios-water'},
      {type: 'Brunch', huntname: 'Brunch Hunt', image: 'img/brunch.jpg', icon: 'ios-restaurant'},
      {type: 'Coffee', huntname: 'Coffee Hunt', image: 'img/coffee.jpg', icon: 'cafe'},
      {type: 'Park', huntname: 'Park Hunt', image: 'img/park.jpg', icon: 'leaf'},
      {type: 'Ramen', huntname: 'Ramen Hunt', image: 'img/ramen.jpg', icon: 'ios-egg'}
      ];

    this.items = [];
    for (let hunt of this.testData) {
      this.items.push({
        title: hunt.type,
        image: hunt.image,
        huntname: hunt.huntname,
        icon: hunt.icon
      });
    }
  }
  navCreateHunt(event, item) {
         console.log('routing to CreteHuntPages');
         this.nav.setRoot(CreateHuntPage, {});
   }

  // itemTapped(event, item) {
  //   console.log('sending item.type... ', item);
  //   this.userInfo = localStorage;
  //   localStorage.startTimeUnix = Date.now();
  //   localStorage.startTime = new Date().toLocaleTimeString()
  //   console.log('sending userInfo... ', this.userInfo);
  //   this.templateService.postData(item.title, this.userInfo)
  //     .then(data => {
  //       this.nav.setRoot(TaskPage, {
  //         locAddress: data.businesses.location.display_address[0] + ', ' + data.businesses.location.display_address[2],
  //         huntID: data.huntID,
  //         currChallenge: data.tasks.content,
  //         locLat: data.businesses.location.coordinate.latitude,
  //         locLng: data.businesses.location.coordinate.longitude,
  //         locName: data.businesses.name,
  //         previousPlaces: [data.businesses],
  //         previousTasks: [data.tasks]
  //       });
  //     })
  //       .catch(error => console.error(error));
  // }
