import {Page, NavController, NavParams, LocalStorage, Storage} from 'ionic-angular';
import {ProfileService} from '../../services/profile/profile-service';
import {AuthService} from '../../services/auth/auth-service';


@Page({
  templateUrl: 'build/pages/profile/profile.html',
  providers: [ProfileService]
})
export class ProfilePage {
  local: Storage = new Storage(LocalStorage);
  // sample types for hunts and friends
  // friends: Array<{username: string, profile_image: string}>;
  // hunts: Array<{type: string, huntname: string, image: string, icon: string}>;

  constructor(private nav: NavController, navParams: NavParams, private profileService: ProfileService, private auth: AuthService) {
    let token = this.local.get('id_token')._result;
    this.profileService.getProfile(token)
      .then(data => {
        console.log(data);
        // this.friends = data.friends;
        // this.hunts = data.hunts;
      })
        .catch(error => console.log(error));
  }
  
  friendTapped(event, friend) {
    
  }

  huntTapped(event, hunt) {
    // this.nav.push(TaskPage, {
    //   locAddress: data.businesses.location.display_address[0] + ', ' + data.businesses.location.display_address[2],
    //   currChallenge: data.tasks.content,
    //   locLat: data.businesses.location.coordinate.latitude,
    //   locLng: data.businesses.location.coordinate.longitude,
    //   locName: data.businesses.name,
    //   previousPlaces: [data.businesses],
    //   previousTasks: [data.tasks]
    // });
  }
}
