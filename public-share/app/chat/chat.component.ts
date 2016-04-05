import {Component, OnInit, ElementRef} from 'angular2/core';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS} from 'ng2-material/all';
import {RouteParams} from 'angular2/router';
import {ChatService} from './chat-service';
import {NgZone} from "angular2/core";
import * as moment from 'moment';

@Component({
  selector: 'my-chat',
  templateUrl: './share/app/chat/chat.component.html',
  styleUrls: ['./share/app/chat/chat.component.css'],
  directives: [MATERIAL_DIRECTIVES],
  providers: [MATERIAL_PROVIDERS, ChatService]
})
export class ChatComponent {
  messages: any;
  socket: any;
  chatBox: any;
  io: any;
  username: any;
  typing: boolean;
  huntID: any;
  token: any;
  id_token: any;
  otherUserTyping: any;
  otherUsername: any;
  nameAdded = false;

  constructor(
    navParams: RouteParams,
    private _chatService: ChatService
  ) {
    this.huntID = navParams.get('huntID');
    this.messages = [];
    this.chatBox = '';

    // watch for messages
    // this._chatService.messageChange.subscribe(messages => console.log('this is the change emitted messages ', messages));

    // watch for typing
    this._chatService.otherUsernameChange.subscribe(otherUsername => this.otherUsername = otherUsername);
    this._chatService.otherUserTypingChange.subscribe(otherUserTyping => this.otherUserTyping = otherUserTyping);

  }

  getUsername(username) {
    this.username = username
    this.nameAdded = true
    // create socket
    this._chatService.createSocket(this.huntID, this.username);
    this._chatService.getMessages()
      .then(messages => {
        console.log('this is the data from _chatService getmessages ', messages);
        this.messages = messages
      })
      .catch(error => console.log('there was an error ', error));
  }

  OnKey(event: KeyboardEvent) {
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
