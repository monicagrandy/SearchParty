import {Page, NavController, NavParams, LocalStorage} from 'ionic-angular';
import {Http, Headers} from 'angular2/http';
import {FORM_DIRECTIVES} from 'angular2/common';
import {JwtHelper} from 'angular2-jwt';
import {ConnectionBackend, HTTP_PROVIDERS} from 'angular2/http';
import {AuthService} from '../../services/auth/auth-service'
import {ChatService} from '../../services/chat/chat-service';
import * as moment from 'moment';
import {FromUnixPipe} from '../../util/am-from-unix-pipe';

@Page({
  templateUrl: 'build/pages/chat/chat.html',
  providers: [
    ConnectionBackend,
    HTTP_PROVIDERS,
    ChatService
  ],
  pipes [FromUnixPipe],
  directives: [FORM_DIRECTIVES]
})
export class Chat {
  messages: any;
  socket: any;
  chatBox: any;
  io: any;
  username: any;
  jwtHelper: JwtHelper = new JwtHelper();
  typing: boolean;
  huntID: any;
  token: any;
  id_token: any;
  otherUserTyping: any;
  otherUsername: any;

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
    this.messages = [];
    this.chatBox = '';
  
    // create socket
    this._chatService.createSocket(this.huntID, this.username);
    
    // watch for messages
    // this._chatService.messageChange.subscribe(messages => console.log('this is the change emitted messages ', messages));
    
    // watch for typing
    this._chatService.otherUsernameChange.subscribe(otherUsername => this.otherUsername = otherUsername);
    this._chatService.otherUserTypingChange.subscribe(otherUserTyping => this.otherUserTyping = otherUserTyping);
    
    this._chatService.updateTime();

    this._chatService.getMessages()
      .then(messages => {
        console.log('this is the data from _chatService getmessages ', messages);
        this.messages = messages})
        .catch(error => console.log('there was an error ', error));
  }

  OnKey(event:KeyboardEvent) {
    if (event) {
      this._chatService.userIsTyping();
    }
  };
  
  send(message) {
    if (message && message !== '') {
      this._chatService.send(message);
    }
    this.chatBox = '';
  }

}
