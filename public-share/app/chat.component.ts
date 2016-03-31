import {Component, OnInit, ElementRef} from 'angular2/core';
import {MATERIAL_DIRECTIVES, MdDialog, MATERIAL_PROVIDERS} from 'ng2-material/all';
import {DOM} from "angular2/src/platform/dom/dom_adapter";
import {MdDialogConfig, MdDialogBasic, MdDialogRef} from "ng2-material/components/dialog/dialog";
import {Media} from "ng2-material/core/util/media";
import {RouteParams} from 'angular2/router';
import {ChatService} from './chat.service';
import {NgZone} from "angular2/core";
import * as moment from 'moment';

@Component({
  selector: 'my-chat',
  templateUrl: './share/app/chat.component.html',
  styleUrls: ['./share/app/chat.component.css'],
  directives: [MATERIAL_DIRECTIVES],
  providers: [MATERIAL_PROVIDERS, ChatService]
})
export class ChatComponent {
    timeout: any;
    typing: boolean;
    huntID: string;
    messages: any;
    zone: any;
    chatBox: any;
    socket: any;
    username: any;
    ADD_MESSAGE_URL: string = 'http://localhost:8000/addChatMessage';
    GET_MESSAGES_URL: string = 'http://localhost:8000/getChatMessages';

  constructor(private _chatService: ChatService, private _params: RouteParams, public dialog: MdDialog, public element: ElementRef) {
    let socket = io.connect('http://localhost:8000');
    this.timeout = undefined;
    this.typing = false;

    this.huntID = _params.get('huntID');
    
    this.messages = [];
    this.zone = new NgZone({enableLongStackTrace: false});
    this.chatBox = "";
    this.socket = socket;
    this.socket.on("chat_message", (msg, username, datetime) => {
      this.zone.run(() => {
        console.log(this.messages);
        datetime = moment.unix(datetime).fromNow();
        this.messages.push([username +": "+ msg + " @ " + datetime]);
      });
    });

    let huntIDObject = {huntID: this.huntID};
    this._chatService.postData(JSON.stringify(huntIDObject), this.GET_MESSAGES_URL)
    .then(messagesFromDB => {
      this.zone.run(() => {
        console.log("messages from DB", messagesFromDB);
        let messagesArray = messagesFromDB.chatMessages;
        for(let i = 0; i < messagesArray.length; i++) {
          let datetime = moment.unix(messagesArray[i].datetime).fromNow();
          this.messages.push([messagesArray[i].username + ": " + messagesArray[i].text + " @ " + datetime]);
        }
      })
    }).catch(error => console.error(error));
    
    this.username = window.prompt('Enter a username!', '');
  }
  
  // showAlert() {
  //   let config = new MdDialogConfig()
  //     .textContent('You can specify some description text in here')
  //     .title('This is an alert title')
  //     .ok('Got it!');
  //   this.dialog.open(MdDialogBasic, this.element, config);
  // };

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
      console.log("username inside chat.ts", this.username);
      console.log("message inside chat.ts", message);

      let messageObject = {
        username: this.username,
        huntID: this.huntID,
        message: message
      };

      this._chatService.postData(JSON.stringify(messageObject), this.ADD_MESSAGE_URL)
      .then(messageAdded => {
        messageAdded = messageAdded[0];
        console.log("message  added", messageAdded);
        this.socket.emit("chat_message", messageAdded.text, this.username, messageAdded.datetime);
      }).catch(error => console.error(error))

    }
    this.chatBox = "";
  }

}
