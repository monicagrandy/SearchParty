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
  items: Array<{title: string, image: string, huntname: string, icon: string, keywords: Array<[{}]>}>;
  local: Storage = new Storage(LocalStorage);
  loadComplete: boolean;
  loadingImg: any;
  userLng: number;
  userLat: number;
  userInfo: {};
  geolocation: {};
  templates: any;

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

    // this.testData = [
    //   {type: 'Bar', huntname: 'Bar Hunt', image: 'img/bar.jpg', icon: 'ios-pint'},
    //   {type: 'Beach', huntname: 'Beach Hunt', image: 'img/beach.jpg', icon: 'ios-water'},
    //   {type: 'Brunch', huntname: 'Brunch Hunt', image: 'img/brunch.jpg', icon: 'ios-restaurant'},
    //   {type: 'Coffee', huntname: 'Coffee Hunt', image: 'img/coffee.jpg', icon: 'cafe'},
    //   {type: 'Park', huntname: 'Park Hunt', image: 'img/park.jpg', icon: 'leaf'},
    //   {type: 'Ramen', huntname: 'Ramen Hunt', image: 'img/ramen.jpg', icon: 'ios-egg'}
    // ];

    this.items = [];

    this.templateService.getData()
    .then(templates => {
      console.log("Templates", templates);
      this.templates = templates;
      for (let hunt of this.templates) {
        console.log("hunt", hunt);
        this.items.push({
          title: hunt.template.type,
          image: hunt.template.image,
          huntname: hunt.template.huntname,
          icon: hunt.template.icon,
          keywords: hunt.keywords
        })
      }
    });
  }
  
  navCreateHunt(event, item) {
    console.log(item.title);
    this.nav.setRoot(CreateHuntPage, {
      title: item.title,
      keywordsArray: item.keywords
    });
  }
}
