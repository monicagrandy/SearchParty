import {Page, NavController, NavParams} from 'ionic-angular';
import {Http, Headers} from 'angular2/http';
import {FORM_DIRECTIVES} from 'angular2/common';
import {JwtHelper} from 'angular2-jwt';
import {AuthService} from '../../services/auth/auth-service'
import {NgZone} from "angular2/core";
// import {io} from "socket.io"

@Page({
  templateUrl: 'build/pages/chat/chat.html',
  directives: [FORM_DIRECTIVES]
})
export class Chat {
   messages: any;
   socket: any;
   zone: any;
   chatBox: any;
   io: any;
   username: any;
   timeout: any;
   timoutFunction: any;

   constructor(
      private http: Http,
      private nav: NavController,
      private navParams: NavParams
   ) {
     let socket = io.connect('http://localhost:8000');
     let typing = false;
     let timeout = undefined;
     this.messages = [];
     this.zone = new NgZone({enableLongStackTrace: false});
     this.chatBox = "";
     this.socket = socket;
     this.socket.on("chat_message", (msg, username) => {
       this.zone.run(() => {
         this.messages.push(msg);
       });
       //clear typing field
       //TODO: remove username div here too;
       clearTimeout(timout);
       timeout = setTimeout(timeoutFunction, 0);
     });

     //See when someone is typing:
      function timeoutFunction() {
        typing = false;
        socket.emit("typing", false);
      }

      //:::UPON USER TYPING, SEND TYPING MESSAGE TO SERVER:::
      function sendTyping(characters) => {
         if(characters > 0) {
            typing = true;
            socket.emit("typing", true);
         } else {
            clearTimeout(timeout);
            timeout = setTimeout(timeoutFunction, 5000);
         }
      }

      //:::UPON USER RECEIVING isTyping FROM SERVER, DISPLAY IT:::
      socket.on("isTyping", function(message, username) {
         console.log('Message & : ', message, username);
       if (data.isTyping) {
          timeout = setTimeout(timeoutFunction, 5000);
          //Append ionic username div
       } else {
          //Remove ionic username div
       }
      });
}


  send(message) {
    if (message && message !== "") {
      this.socket.emit("chat_message", message, this.username);
    }
    this.chatBox = "";
  }
}
