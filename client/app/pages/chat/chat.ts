import {Page, NavController, NavParams} from 'ionic-angular';
import {Http, Headers} from 'angular2/http';
import {FORM_DIRECTIVES} from 'angular2/common';
import {JwtHelper} from 'angular2-jwt';
import {AuthService} from '../../services/auth/auth-service';

@Page({
  templateUrl: 'build/pages/chat/chat.html',
  directives: [FORM_DIRECTIVES]
})
export class Chat {
   messages: Array<{message: string}>;
   socketHost: string;
   constructor(
      private http: Http,
      private nav: NavController,
      private navParams: NavParams
   ) {
      this.messages = [];
      this.socketHost = 'http://192.168.57.1:3000'; //Change
      // this.zone = new NgZone({enableLongStackTrace: false});
        http.get(this.socketHost + "/").subscribe((success) => {
            var data = success.json();
            for(var i = 0; i < data.length; i++) {
                this.messages.push(data[i].message);
            }
        }, (error) => {
            console.log(JSON.stringify(error));
        });
        this.chatBox = "";
        this.socket = io(this.socketHost);
        this.socket.on("chat_message", (msg) => {
            this.zone.run(() => {
                this.messages.push(msg);
            });
        });
       }
       send(message) {
           if(message && message != "") {
               this.socket.emit("chat_message", message);
           }
           this.chatBox = "";
       }
    }