System.register(['angular2/core', 'angular2/http', 'rxjs/add/operator/map'], function(exports_1, context_1) {
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
    var core_1, http_1;
    var APIService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (_1) {}],
        execute: function() {
            APIService = (function () {
                function APIService(_http) {
                    this._http = _http;
                    this.SINGLE_HUNT_URL = localStorage.singleHunt || 'https://getsearchparty.com/singleHunt'; //update this later
                    this.ADD_MESSAGE_URL = localStorage.addChatMessage || 'https://getsearchparty.com/addChatMessage';
                    this.GET_MESSAGES_URL = localStorage.getChatMessages || 'https://getsearchparty.com/getChatMessages';
                    this.contentHeader = new http_1.Headers({ 'Content-Type': 'application/json' });
                }
                APIService.prototype.getData = function (dataObj, urlName) {
                    var _this = this;
                    var urls = {
                        hunt: this.SINGLE_HUNT_URL,
                        addChatMessage: this.ADD_MESSAGE_URL,
                        getChatMessages: this.GET_MESSAGES_URL
                    };
                    var url = urls[urlName];
                    var httpPostPromise = new Promise(function (resolve, reject) {
                        console.log('inside post promise');
                        _this._http.post(url, JSON.stringify(dataObj), { headers: _this.contentHeader })
                            .map(function (res) { return res.json(); })
                            .subscribe(function (data) {
                            console.log('data from promise: ', data);
                            resolve(data);
                        }, function (err) {
                            _this.logError(err);
                            reject(err);
                        }, function () { return console.log('data recieved'); });
                    });
                    return httpPostPromise;
                };
                APIService.prototype.logError = function (err) {
                    console.error('There was an error: ' + err);
                };
                APIService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], APIService);
                return APIService;
            }());
            exports_1("APIService", APIService);
        }
    }
});
//# sourceMappingURL=api-service.js.map