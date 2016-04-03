System.register(['angular2/core', 'angular2/http', 'moment'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1, moment;
    var ChatService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (moment_1) {
                moment = moment_1;
            }],
        execute: function() {
            ChatService = (function () {
                function ChatService(_http) {
                    this._http = _http;
                    this.zone = new core_1.NgZone({ enableLongStackTrace: false });
                    this.SOCKET_URL = localStorage.socket || 'https://getsearchparty.com';
                    this.ADD_MESSAGE_URL = localStorage.addChatMessage || 'https://getsearchparty.com/addChatMessage';
                    this.GET_MESSAGES_URL = localStorage.getChatMessages || 'https://getsearchparty.com/getChatMessages';
                    this.contentHeader = new http_1.Headers({ 'Content-Type': 'application/json' });
                    this.messageChange = new core_1.EventEmitter();
                    this.otherUsernameChange = new core_1.EventEmitter();
                    this.otherUserTypingChange = new core_1.EventEmitter();
                    this.messages = [];
                    this.otherUserTyping = false;
                    this.otherUsername = '';
                    this.timeout;
                    this.chatBox = '';
                }
                ChatService.prototype.createSocket = function (huntID, username) {
                    var _this = this;
                    // update url later
                    console.log('create socket is called ', huntID, username);
                    this.socket = io.connect(this.SOCKET_URL);
                    this.huntID = huntID;
                    this.username = username;
                    console.log('this is the username created with the socket ', username);
                    this.socket.on("connect", function () {
                        console.log('chat socket emitted');
                        _this.socket.emit('huntChatRoom', _this.huntID);
                    });
                    this.updateSocketChatMessage();
                    this.updateSocketChatIsTyping();
                };
                ChatService.prototype.updateSocketChatMessage = function () {
                    var _this = this;
                    this.socket.on("chat_message", function (msg, username, datetime) {
                        _this.zone.run(function () {
                            console.log('this is the message received from socket chat update ', msg);
                            datetime = moment.unix(datetime).fromNow();
                            _this.messages.push([username, msg, datetime]);
                            // this.messageChange.emit(this.messages);
                        });
                    });
                };
                ChatService.prototype.updateSocketChatIsTyping = function () {
                    var _this = this;
                    this.socket.on("isTyping", function (bool, username) {
                        if (bool === true && username !== _this.username) {
                            _this.otherUsername = username;
                            _this.otherUsernameChange.emit(_this.otherUsername);
                            _this.otherUserTyping = true;
                            _this.otherUserTypingChange.emit(true);
                        }
                        else {
                            _this.otherUserTyping = false;
                            _this.otherUserTypingChange.emit(false);
                        }
                    });
                };
                ChatService.prototype.invocation = function () {
                    var _this = this;
                    this.timeout = setTimeout(function () {
                        _this.socket.emit('typing', false, _this.username, _this.huntID);
                    }, 1000);
                };
                ;
                ChatService.prototype.userIsTyping = function () {
                    this.socket.emit('typing', true, this.username, this.huntID);
                    clearTimeout(this.timeout);
                    this.invocation();
                };
                ChatService.prototype.getMessages = function () {
                    var _this = this;
                    var huntIDObject = { huntID: this.huntID };
                    return this.postData(JSON.stringify(huntIDObject), 'getMessages')
                        .then(function (messagesFromDB) {
                        return _this.zone.run(function () {
                            return new Promise(function (resolve, reject) {
                                var messagesArray = messagesFromDB.chatMessages;
                                for (var i = 0; i < messagesArray.length; i++) {
                                    var datetime = moment.unix(messagesArray[i].datetime).fromNow();
                                    _this.messages.push([messagesArray[i].username, messagesArray[i].text, datetime]);
                                    console.log('these are the messages from getMessages() ', _this.messages);
                                }
                                resolve(_this.messages);
                                reject('error getting messages');
                            });
                        });
                    })
                        .catch(function (error) { return console.error(error); });
                };
                ChatService.prototype.send = function (message) {
                    var _this = this;
                    clearTimeout(this.timeout);
                    this.socket.emit('typing', false, this.username, this.huntID);
                    var messageObject = {
                        username: this.username,
                        huntID: this.huntID,
                        message: message
                    };
                    this.postData(JSON.stringify(messageObject), 'addMessage')
                        .then(function (messageAdded) {
                        messageAdded = messageAdded[0];
                        console.log('message  added', messageAdded);
                        _this.socket.emit('chat_message', messageAdded.text, messageAdded.username, messageAdded.datetime, _this.huntID);
                    })
                        .catch(function (error) { return console.error(error); });
                };
                ChatService.prototype.postData = function (data, urlName) {
                    var _this = this;
                    console.log("called post req");
                    this.urls = {
                        addMessage: this.ADD_MESSAGE_URL,
                        getMessages: this.GET_MESSAGES_URL
                    };
                    var url = this.urls[urlName];
                    var httpPromise = new Promise(function (resolve, reject) {
                        console.log("data inside chat Promise", data);
                        _this._http.post(url, data, { headers: _this.contentHeader })
                            .map(function (res) { return res.json(); })
                            .subscribe(function (data) {
                            console.log("data from promise: ", data);
                            resolve(data);
                        }, function (err) { return reject(err); }, function () { return console.log('data recieved'); });
                    });
                    return httpPromise;
                };
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], ChatService.prototype, "messageChange", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], ChatService.prototype, "otherUsernameChange", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], ChatService.prototype, "otherUserTypingChange", void 0);
                ChatService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], ChatService);
                return ChatService;
            }());
            exports_1("ChatService", ChatService);
        }
    }
});
//# sourceMappingURL=chat.service.js.map