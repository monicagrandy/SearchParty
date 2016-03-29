import {Page, NavController, NavParams} from 'ionic-angular';
import {Http, Headers} from 'angular2/http';
import {FORM_DIRECTIVES} from 'angular2/common';
import {JwtHelper} from 'angular2-jwt';
import {AuthService} from '../../services/auth/auth-service'
import {NgZone} from "angular2/core";;

@Page({
  templateUrl: 'build/pages/chat/chat.html',
  directives: [FORM_DIRECTIVES]
})
export class Chat {
   messages: any;
   socket: any;
   zone: any;
   chatBox: any;
   
   constructor(
      private http: Http,
      private nav: NavController,
      private navParams: NavParams
   ) {
     let socket = io();
     this.messages = [];
     this.zone = new NgZone({enableLongStackTrace: false});
     this.chatBox = "";
     this.socket = socket;
     this.socket.on("chat_message", msg => {
       this.zone.run(() => {
         this.messages.push(msg);
       });
     });
   }
   
  send(message) {
    if (message && message != "") {
      this.socket.emit("chat_message", message);
    }
    this.chatBox = "";
  }   
}