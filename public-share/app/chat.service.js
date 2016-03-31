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
    var ChatService;
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
            ChatService = (function () {
                function ChatService(_http) {
                    this._http = _http;
                    this.contentHeader = new http_1.Headers({ 'Content-Type': 'application/json' });
                }
                ChatService.prototype.postData = function (data, url) {
                    var _this = this;
                    console.log("called post req");
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
                ChatService = __decorate([
                    // we need to import this now
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