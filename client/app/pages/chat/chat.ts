import {Page, NavController, NavParams, LocalStorage} from 'ionic-angular';
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
   jwtHelper: JwtHelper = new JwtHelper();
   typing: boolean;

   constructor(
      private http: Http,
      private nav: NavController,
      private navParams: NavParams
   ) {
     let socket = io.connect('http://localhost:8000');
     this.timeout = undefined;
     this.typing = false;

     this.token = localStorage.id_token;
     if (this.token) {
       this.username = this.jwtHelper.decodeToken(this.token).username;
     }

     this.messages = [];
     this.zone = new NgZone({enableLongStackTrace: false});
     this.chatBox = "";
     this.socket = socket;
     this.socket.on("chat_message", (msg, username) => {
       this.zone.run(() => {
          console.log(this.messages);
         this.messages.push([username +": "+ msg]);
       });
       clearTimeout(this.timeout);
       this.timeout = setTimeout(this.timeoutFunction, 0);
     });
     //  clear typing field
     //  TODO: remove username div here too;

      //:::UPON USER TYPING, SEND TYPING MESSAGE TO SERVER:::
      // sendTyping(characters) => {
      //    if(characters > 0) {
      //       typing = true;
      //       socket.emit("typing", true);
      //    } else {
      //       clearTimeout(timeout);
      //       timeout = setTimeout(timeoutFunction, 5000);
      //    }
      // }

      //:::UPON USER RECEIVING isTyping FROM SERVER, DISPLAY IT:::
      // socket.on("isTyping", function(message, username) {
      //    console.log('Message & : ', message, username);
      //  if (message && username) {
      //     timeout = setTimeout(timeoutFunction, 5000);
      //     //Append ionic username div
      //  } else {
      //     //Remove ionic username div
      //  }
      // });
}

   timeoutFunction() {
      this.typing = false;
      this.socket.emit('typing', false);
   }

  OnKey(event:KeyboardEvent) {
     console.log('this is the keyup event ', event);
     if (event) {
        console.log('ln 84: ', this.typing);
        if (this.typing === false) {
           this.typing = true;
           console.log('emitting true for typing', this.typing);
           this.socket.emit('typing', true);
           clearTimeout(this.timeout);
           this.timeout = setTimeout(this.timeoutFunction.bind(this), 1500);
        }
     }
 }


  send(message) {
    if (message && message !== "") {
      this.socket.emit("chat_message", message, this.username);
    }
    this.chatBox = "";
  }
}
