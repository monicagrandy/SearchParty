import {Page, NavController, NavParams, LocalStorage} from 'ionic-angular';
import {Http, Headers} from 'angular2/http';
import {FORM_DIRECTIVES} from 'angular2/common';
import {JwtHelper} from 'angular2-jwt';
import {ConnectionBackend, HTTP_PROVIDERS} from 'angular2/http';
import {AuthService} from '../../services/auth/auth-service'
import {NgZone} from "angular2/core";
import {ChatService} from '../../services/chat/chat-service';
import * as moment from 'moment';

@Page({
  templateUrl: 'build/pages/chat/chat.html',
  providers: [
    ConnectionBackend,
    HTTP_PROVIDERS,
    ChatService
  ],
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
  ADD_MESSAGE_URL: string = 'https://getsearchparty.com/addChatMessage';
  GET_MESSAGES_URL: string = 'https://getsearchparty.com/getChatMessages';
  huntID: any;
  token: any;
  id_token: any;
  otherUserTyping: any;
  otherUsername: any;
  chatMessages: any;

   constructor(
      private http: Http,
      private nav: NavController,
      navParams: NavParams,
      private _chatService: ChatService
   ) {
   this.token = localStorage.id_token;
   if (this.token) {
      this.username = this.jwtHelper.decodeToken(this.token).username;
   }
   this.huntID = navParams.get('huntID');
   let socket = io.connect('https://getsearchparty.com');
   this.otherUserTyping = false;
   this.otherUsername = '';
   this.messages = [];
   this.timeout;
   this.zone = new NgZone({enableLongStackTrace: false});
   this.chatBox = "";
   this.socket = socket;

   this.socket.on("connect", () => {
      this.socket.emit('huntChatRoom', this.huntID);
   });

   this.socket.on("chat_message", (msg, username, datetime) => {
      this.zone.run(() => {
        console.log(this.messages);
        datetime = moment.unix(datetime).fromNow();
        this.messages.push([username, msg, datetime]);
        console.log('Messages Array::', messages);
      });
   });

   this.socket.on("isTyping", (bool, username) => {
      if(bool === true && username !== this.username) {
         this.otherUsername = username;
         this.otherUserTyping = true;
      } else {
         this.otherUserTyping = false;
      }
   });

   let huntIDObject = {huntID: this.huntID};
   this._chatService.postData(JSON.stringify(huntIDObject), this.GET_MESSAGES_URL)
   .then(messagesFromDB => {
      this.zone.run(() => {
        let messagesArray = messagesFromDB.chatMessages;
        for(let i = 0; i < messagesArray.length; i++) {
          let datetime = moment.unix(messagesArray[i].datetime).fromNow();
          this.messages.push([messagesArray[i].username + ": " + messagesArray[i].text + " @ " + datetime]);
        }
      })
   }).catch(error => console.error(error));
};

invocation() {
   this.timeout = setTimeout(
      () => {
         this.socket.emit('typing', false, this.username, this.huntID);
      }, 1000);
};

OnKey(event:KeyboardEvent) {
   if (event) {
     this.socket.emit('typing', true, this.username, this.huntID);
     clearTimeout(this.timeout);
     this.invocation();
   }
};

send(message) {
   if (message && message !== "") {
      clearTimeout(this.timeout);
      this.socket.emit('typing', false, this.username, this.huntID);
      let messageObject = {
        username: this.username,
        huntID: this.huntID,
        message: message
      };

      this._chatService.postData(JSON.stringify(messageObject), this.ADD_MESSAGE_URL)
      .then(messageAdded => {
        messageAdded = messageAdded[0];
        console.log("message  added", messageAdded);
        this.socket.emit("chat_message", messageAdded.text, messageAdded.username, messageAdded.datetime, this.huntID);
     }).catch(error => {
        console.error(error)
     });

   }
   this.chatBox = "";
};
}
