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
  ADD_MESSAGE_URL: string = 'http://localhost:8000/addChatMessage';
  GET_MESSAGES_URL: string = 'http://localhost:8000/getChatMessages';
  huntID: any;

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
   let socket = io.connect('http://localhost:8000');
   this.timeout = undefined;
   this.typing = false;
   this.otherUserTyping = false;
   this.otherUsername = '';
   this.messages = [];
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
      });
   });

   this.socket.on("isTyping", (username, room) => {
      this.otherUsername = username;
      this.otherUserTyping = true;
   }

   let huntIDObject = {huntID: this.huntID};
   this._chatService.postData(JSON.stringify(huntIDObject), this.GET_MESSAGES_URL)
   .then(messagesFromDB => {
      this.zone.run(() => {
        console.log("messages from DB", messagesFromDB);
        let messagesArray = messagesFromDB.chatMessages;
        for(let i = 0; i < messagesArray.length; i++) {
          let datetime = moment.unix(messagesArray[i].datetime).fromNow();
          console.log('THIS IS BEING PUSHED TO MESSAGES ARRAY');
          console.log(messagesArray[i].username, messagesArray[i].text, datetime);
          this.messages.push([messagesArray[i].username + ": " + messagesArray[i].text + " @ " + datetime]);
        }
      })
   }).catch(error => console.error(error));
}

  timeoutFunction() {
    this.typing = false;
    this.socket.emit('typing', false);
  }

  timeoutFunction2() {
     this.otherUserTyping = false;
     this.socket.emit('typing', )
 }

  OnKey(event:KeyboardEvent) {
    if (event) {
      if (this.typing === false) {
        this.typing = true;
        this.socket.emit('typing', true, this.username, this.huntID);
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.timeoutFunction.bind(this), 1500);
      }
    }
  }

  send(message) {
    if (message && message !== "") {

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
  }
}
