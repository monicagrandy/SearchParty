System.register(['angular2/core', 'ng2-material/all', 'angular2/router', './chat.service', './amfromunix.pipe'], function(exports_1, context_1) {
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
    var core_1, all_1, router_1, chat_service_1, amfromunix_pipe_1;
    var ChatComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
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
            function (amfromunix_pipe_1_1) {
                amfromunix_pipe_1 = amfromunix_pipe_1_1;
            }],
        execute: function() {
            ChatComponent = (function () {
                function ChatComponent(navParams, _chatService) {
                    var _this = this;
                    this._chatService = _chatService;
                    this.nameAdded = false;
                    this.huntID = navParams.get('huntID');
                    this.messages = [];
                    this.chatBox = '';
                    // watch for messages
                    // this._chatService.messageChange.subscribe(messages => console.log('this is the change emitted messages ', messages));
                    // watch for typing
                    this._chatService.otherUsernameChange.subscribe(function (otherUsername) { return _this.otherUsername = otherUsername; });
                    this._chatService.otherUserTypingChange.subscribe(function (otherUserTyping) { return _this.otherUserTyping = otherUserTyping; });
                }
                ChatComponent.prototype.getUsername = function (username) {
                    var _this = this;
                    this.username = username;
                    this.nameAdded = true;
                    // create socket
                    this._chatService.createSocket(this.huntID, this.username);
                    this._chatService.getMessages()
                        .then(function (messages) {
                        console.log('this is the data from _chatService getmessages ', messages);
                        _this.messages = messages;
                    })
                        .catch(function (error) { return console.log('there was an error ', error); });
                };
                ChatComponent.prototype.OnKey = function (event) {
                    if (event) {
                        this._chatService.userIsTyping();
                    }
                };
                ;
                ChatComponent.prototype.send = function (message) {
                    if (message && message !== '') {
                        this._chatService.send(message);
                    }
                    this.chatBox = '';
                };
                ChatComponent = __decorate([
                    core_1.Component({
                        selector: 'my-chat',
                        templateUrl: './share/app/chat.component.html',
                        styleUrls: ['./share/app/chat.component.css'],
                        pipes: [amfromunix_pipe_1.FromUnixPipe],
                        directives: [all_1.MATERIAL_DIRECTIVES],
                        providers: [all_1.MATERIAL_PROVIDERS, chat_service_1.ChatService]
                    }), 
                    __metadata('design:paramtypes', [router_1.RouteParams, chat_service_1.ChatService])
                ], ChatComponent);
                return ChatComponent;
            }());
            exports_1("ChatComponent", ChatComponent);
        }
    }
});
//# sourceMappingURL=chat.component.js.map