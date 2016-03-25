import {Page, NavController, NavParams, LocalStorage, Storage} from 'ionic-angular';
import {ProfileService} from '../../services/profile/profile-service';
import {AuthService} from '../../services/auth/auth-service';
import {PastHuntsPage} from '../past-hunts/past-hunts';

@Page({
  templateUrl: 'build/pages/profile/profile.html',
  providers: [ProfileService]
})
export class ProfilePage {
  local: Storage = new Storage(LocalStorage);
  hunts: any;
  // sample types for hunts and friends
  // friends: Array<{username: string, profile_image: string}>;
  // hunts: Array<{type: string, huntname: string, image: string, icon: string}>;

  constructor(private nav: NavController, navParams: NavParams, private profileService: ProfileService, private auth: AuthService) {
    let token = this.local.get('id_token')._result;
    console.log('this is the token before it is sent', token);
    this.profileService.getProfile(token)
      .then(data => {
        console.log(data.hunts);
        // this.friends = data.friends;
        this.hunts = data.hunts;
      })
        .catch(error => console.log(error));
  }
  
  friendTapped(event, friend) {
    
  }

  huntTapped(event, hunt) {
    this.nav.push(PastHuntsPage, {
      previousHuntTasksAndLocations: hunt.tasks,
      huntID: hunt.stats.huntID
    });
  }
}
