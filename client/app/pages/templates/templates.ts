import {Page, NavController, NavParams, LocalStorage, Storage} from 'ionic-angular';
import {TaskPage} from '../tasks/tasks';
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
  loadComplete = false;
  loadingImg: any;
  userLng: number;
  userLat: number;
  userInfo: {};
  geolocation: {};

  constructor(private nav: NavController, navParams: NavParams, private templateService: TemplateService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    
    this.loadingImg = 'img/poi.gif'

    if (navigator.geolocation) {
      console.log(this.loadComplete)
      navigator.geolocation.watchPosition((position => {
        this.local.set('userLat', position.coords.latitude);
        this.local.set('userLng', position.coords.longitude);
        setTimeout(()=>{this.loadComplete = true; console.log(this.loadComplete)}, 1000);
      }), (error => console.log(error)), {})
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

  itemTapped(event, item) {
    console.log('sending item.type... ', item);
    this.userInfo = localStorage;
    console.log('sending userInfo... ', this.userInfo);
    // this.geolocation.longitude = this.userInfo.userLng;
    // console.log(this.geolocation);
    this.templateService.postData(item.title, this.userInfo)
      .then(data => {
        this.nav.setRoot(TaskPage, {
          locAddress: data.businesses.location.display_address[0] + ', ' + data.businesses.location.display_address[2],
          currChallenge: data.tasks.content,
          locLat: data.businesses.location.coordinate.latitude,
          locLng: data.businesses.location.coordinate.longitude,
          locName: data.businesses.name,
          previousPlaces: [data.businesses],
          previousTasks: [data.tasks]
        });
      })
        .catch(error => console.log(error));
    // this.nav.push(TaskPage, {
    //   item: item
    // });
  }


}
