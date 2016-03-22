import {Page, NavController, NavParams, LocalStorage, Storage} from 'ionic-angular';
import {TaskPage} from '../tasks/tasks';
import {ProfileService} from '../../services/profile/profile-service';

@Page({
  templateUrl: 'build/pages/profile/profile.html',
  providers: [ProfileService]
})
export class ProfilePage {
  selectedItem: any;
  testData: Array<{type: string, huntname: string, image: string, icon: string}>;
  items: Array<{title: string, image: string, huntname: string, icon: string}>;
  local: Storage = new Storage(LocalStorage);
  userLng: number;
  userLat: number;
  userInfo: {};
  geolocation: {};

  constructor(private nav: NavController, navParams: NavParams, private profileService: ProfileService) {
    
  }

  itemTapped(event, item) {
    console.log('sending item.type... ', item);
    this.userInfo = localStorage;
    console.log('sending userInfo... ', this.userInfo);
    this.templateService.postData(item.title, this.userInfo)
      .then(data => {
        this.nav.push(TaskPage, {
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
  }
}
