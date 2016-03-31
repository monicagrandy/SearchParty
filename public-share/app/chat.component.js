System.register(['angular2/core', 'ng2-material/all', 'angular2/router', './chat.service', 'moment'], function(exports_1, context_1) {
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
    var core_1, all_1, router_1, chat_service_1, core_2, moment;
    var ChatComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
                core_2 = core_1_1;
            },
            function (all_1_1) {
                all_1 = all_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (chat_service_1_1) {
                chat_service_1 = chat_service_1_1;
            },
            function (moment_1) {
                moment = moment_1;
            }],
        execute: function() {
            ChatComponent = (function () {
                function ChatComponent(_chatService, _params, dialog, element) {
                    var _this = this;
                    this._chatService = _chatService;
                    this._params = _params;
                    this.dialog = dialog;
                    this.element = element;
                    this.ADD_MESSAGE_URL = 'http://localhost:8000/addChatMessage';
                    this.GET_MESSAGES_URL = 'http://localhost:8000/getChatMessages';
                    this.huntID = _params.get('huntID');
                    var socket = io.connect('http://localhost:8000');
                    this.timeout = undefined;
                    this.typing = false;
                    this.messages = [];
                    this.zone = new core_2.NgZone({ enableLongStackTrace: false });
                    this.chatBox = "";
                    this.socket = socket;
                    this.socket.on("connect", function () {
                        _this.socket.emit('huntChatRoom', _this.huntID);
                    });
                    this.socket.on("chat_message", function (msg, username, datetime) {
                        _this.zone.run(function () {
                            console.log(_this.messages);
                            datetime = moment.unix(datetime).fromNow();
                            _this.messages.push([username, msg, datetime]);
                        });
                    });
                    var huntIDObject = { huntID: this.huntID };
                    this._chatService.postData(JSON.stringify(huntIDObject), this.GET_MESSAGES_URL)
                        .then(function (messagesFromDB) {
                        _this.zone.run(function () {
                            console.log("messages from DB", messagesFromDB);
                            var messagesArray = messagesFromDB.chatMessages;
                            for (var i = 0; i < messagesArray.length; i++) {
                                var datetime = moment.unix(messagesArray[i].datetime).fromNow();
                                console.log('THIS IS BEING PUSHED TO MESSAGES ARRAY');
                                console.log(messagesArray[i].username, messagesArray[i].text, datetime);
                                _this.messages.push([messagesArray[i].username + ": " + messagesArray[i].text + " @ " + datetime]);
                            }
                        });
                    }).catch(function (error) { return console.error(error); });
                    //Change this later ethan, jesus dude
                    this.username = window.prompt('Enter a username!', '');
                }
                ChatComponent.prototype.timeoutFunction = function () {
                    this.typing = false;
                    this.socket.emit('typing', false);
                };
                ChatComponent.prototype.OnKey = function (event) {
                    console.log('this is the keyup event ', event);
                    if (event) {
                        console.log('ln 84: ', this.typing);
                        if (this.typing === false) {
                            this.typing = true;
                            console.log('emitting true for typing', this.typing);
                            this.socket.emit('typing', true, this.huntID);
                            clearTimeout(this.timeout);
                            this.timeout = setTimeout(this.timeoutFunction.bind(this), 1500);
                        }
                    }
                };
                ChatComponent.prototype.send = function (message) {
                    var _this = this;
                    if (message && message !== "") {
                        var messageObject = {
                            username: this.username,
                            huntID: this.huntID,
                            message: message
                        };
                        this._chatService.postData(JSON.stringify(messageObject), this.ADD_MESSAGE_URL)
                            .then(function (messageAdded) {
                            messageAdded = messageAdded[0];
                            console.log("message  added", messageAdded);
                            _this.socket.emit("chat_message", messageAdded.text, messageAdded.username, messageAdded.datetime, _this.huntID);
                        }).catch(function (error) {
                            console.error(error);
                        });
                    }
                    this.chatBox = "";
                };
                ChatComponent = __decorate([
                    core_1.Component({
                        selector: 'my-chat',
                        templateUrl: './share/app/chat.component.html',
                        styleUrls: ['./share/app/chat.component.css'],
                        directives: [all_1.MATERIAL_DIRECTIVES],
                        providers: [all_1.MATERIAL_PROVIDERS, chat_service_1.ChatService]
                    }), 
                    __metadata('design:paramtypes', [chat_service_1.ChatService, router_1.RouteParams, all_1.MdDialog, core_1.ElementRef])
                ], ChatComponent);
                return ChatComponent;
            }());
            exports_1("ChatComponent", ChatComponent);
        }
    }
});
//# sourceMappingURL=chat.component.js.map