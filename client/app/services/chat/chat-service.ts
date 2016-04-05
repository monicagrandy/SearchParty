import {Injectable, NgZone, Output, Input, EventEmitter} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {Storage, LocalStorage} from 'ionic-angular';
import * as moment from 'moment';

@Injectable()
export class ChatService {
  local: Storage = new Storage(LocalStorage);
  socket: any;
  huntID: string;
  username: string;
  otherUserTyping: boolean;
  otherUsername: string;
  currTime: any;
  timeout: any;
  zone = new NgZone({enableLongStackTrace: false});
  chatBox: any;
  SOCKET_URL: string = localStorage.socket || 'https://getsearchparty.com';
  ADD_MESSAGE_URL: string = localStorage.addChatMessage || 'https://getsearchparty.com/addChatMessage';
  GET_MESSAGES_URL: string = localStorage.getChatMessages || 'https://getsearchparty.com/getChatMessages'; 
  contentHeader: Headers = new Headers({'Content-Type': 'application/json'});
  urls: any;
  messages: any;
  runMomentUpdate: any;
  
  @Output() messageChange = new EventEmitter();
  @Output() otherUsernameChange = new EventEmitter();
  @Output() otherUserTypingChange = new EventEmitter();
  
  constructor(private _http:Http) {
   this.messages = [];
   this.otherUserTyping = false;
   this.otherUsername = '';
   this.timeout;
   this.chatBox = '';
   
   this.runMomentUpdate = this.momentUpdate();
  }

  momentUpdate() {
    console.log('starting moment update!!');
    let messages = this.messages;
    console.log('these are the messages in momentUpdate ', messages);
    setInterval(() => {
     messages.forEach((msg) => {
       if(msg[3]){
         console.log("updating time for ", msg)
         msg[2] = moment.unix(msg[3]).fromNow()
         console.log(msg[2])
       }
     })
    }, 60000);
  }  
  
  createSocket(huntID, username) {
    // update url later
    console.log('create socket is called ', huntID, username)
    this.socket = io.connect(this.SOCKET_URL);
    this.huntID = huntID;
    this.username = username;
    console.log('this is the username created with the socket ', username);
    this.socket.on("connect", () => {
      console.log('chat socket emitted');
      this.socket.emit('huntChatRoom', this.huntID);
    });
    this.updateSocketChatMessage();
    this.updateSocketChatIsTyping();
  }
  
  updateSocketChatMessage() {
   this.socket.on("chat_message", (msg, username, datetime) => {
      this.zone.run(() => {
        console.log('this is the message received from socket chat update ', msg);
        this.currTime = datetime;
        datetime = moment.unix(datetime).fromNow();
        this.messages.push([username, msg, datetime, this.currTime]);
        console.log('this is the new this.messages with pushed in data ', this.messages);
        console.log('killing setInterval');
        clearInterval(this.runMomentUpdate);
        console.log('running interval again');
        this.momentUpdate();
        // this.messageChange.emit(this.messages);
      });
    }); 
  }
  
  updateSocketChatIsTyping() {
    this.socket.on("isTyping", (bool, username) => {
      if (bool === true && username !== this.username) { 
        this.otherUsername = username;
        this.otherUsernameChange.emit(this.otherUsername);
        this.otherUserTyping = true;
        this.otherUserTypingChange.emit(true);
      } else {
        this.otherUserTyping = false;
        this.otherUserTypingChange.emit(false);
      }
    });  
  }
  
  invocation() {
    this.timeout = setTimeout(() => {
      this.socket.emit('typing', false, this.username, this.huntID);
    }, 1000);
  };
  
  userIsTyping() {
    this.socket.emit('typing', true, this.username, this.huntID);
    clearTimeout(this.timeout);
    this.invocation();    
  }
  
  getMessages() {
    let huntIDObject = {huntID: this.huntID};
    return this.postData(JSON.stringify(huntIDObject), 'getMessages')
      .then(messagesFromDB => {
        return this.zone.run(() => {
          return new Promise((resolve, reject) => {
            let messagesArray = messagesFromDB.chatMessages;
            for (let i = 0; i < messagesArray.length; i++) {
              this.currTime = messagesArray[i].datetime;
              let datetime = moment.unix(messagesArray[i].datetime).fromNow();
              this.messages.push([messagesArray[i].username, messagesArray[i].text, datetime, this.currTime]);
              console.log('these are the messages from getMessages() ', this.messages);
            }
            resolve(this.messages);
            reject('error getting messages');           
          });

        })
      })
      .catch(error => console.error(error));    
    }
  
  send(message) {
    clearTimeout(this.timeout);
    this.socket.emit('typing', false, this.username, this.huntID);

    let messageObject = {
      username: this.username,
      huntID: this.huntID,
      message: message
    };

    this.postData(JSON.stringify(messageObject), 'addMessage')
      .then(messageAdded => {
        messageAdded = messageAdded[0];
        console.log('message  added', messageAdded);
        this.socket.emit('chat_message', messageAdded.text, messageAdded.username, messageAdded.datetime, this.huntID);
      })
        .catch(error => console.error(error));
    }

  postData(data, urlName) {
    console.log("called post req");
    
    this.urls = {
      addMessage: this.ADD_MESSAGE_URL,
      getMessages: this.GET_MESSAGES_URL 
    };
    
    let url = this.urls[urlName];

    let httpPromise = new Promise((resolve, reject) => {
      console.log("data inside chat Promise", data);
      this._http.post(url, data, { headers: this.contentHeader })
        .map(res => res.json())
        .subscribe(
        data => {
          console.log("data from promise: ", data);
          resolve(data);
        },
        err => reject(err),
        () => console.log('data recieved')
        )
    })

    return httpPromise;
  }

}
