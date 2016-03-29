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
   io: any;
   username: any;
   timeout: any;
   timoutFunction: any;

   constructor(
      private http: Http,
      private nav: NavController,
      private navParams: NavParams
   ) {
     let socket = this.io();
     this.messages = [];
     this.zone = new NgZone({enableLongStackTrace: false});
     this.chatBox = "";
     this.socket = socket;
     this.socket.on("chat_message", msg => {
       this.zone.run(() => {
         this.messages.push(msg);
       });
     });

     //See when someone is typing:
     var typing = false;
     var timeout = undefined;

      function timeoutFunction() {
        typing = false;
        socket.emit("typing", false);
      }

      // $("#msg").keypress(function(e){
      //   if (e.which !== 13) {
      //     if (typing === false && myRoomID !== null && $("#msg").is(":focus")) {
      //       typing = true;
      //       socket.emit("typing", true);
      //     } else {
      //       clearTimeout(timeout);
      //       timeout = setTimeout(timeoutFunction, 5000);
      //     }
      //   }
      // });
      //:::UPON USER TYPING, SEND TYPING MESSAGE TO SERVER:::
      sendTyping(characters) => {
         if(characters > 0) {
            typing = true;
            socket.emit("typing", true);
         } else {
            clearTimeout(timeout);
            timeout = setTimeout(timeoutFunction, 5000);
         }
      }

      // socket.on("isTyping", function(data) {
      //   if (data.isTyping) {
      //     if ($("#"+data.person+"").length === 0) {
      //       $("#updates").append("<li id='"+ data.person +"'><span class='text-muted'><small><i class='fa fa-keyboard-o'></i>" + data.person + " is typing.</small></li>");
      //       timeout = setTimeout(timeoutFunction, 5000);
      //     }
      //   } else {
      //     $("#"+data.person+"").remove();
      //   }
      // });
      //:::UPON USER RECEIVING isTyping FROM SERVER, DISPLAY IT:::
      socket.on("isTyping", function(data) {
         console.log('Data from server about typing: ', data);
       if (data.isTyping) {
          timeout = setTimeout(timeoutFunction, 5000);
          //Append ionic username div
       } else {
          //Remove ionic username div
       }
      });


      socket.on("chat", function(person, msg) {
        $("#msgs").append("<li><strong><span class='text-success'>" + person.name + "</span></strong>: " + msg + "</li>");
        //clear typing field
         $("#"+person.name+"").remove();
         clearTimeout(timeout);
         timeout = setTimeout(timeoutFunction, 0);
      });
}


  send(message) {
    if (message && message != "") {
      this.socket.emit("chat_message", message, this.username);
    }
    this.chatBox = "";
  }
}
