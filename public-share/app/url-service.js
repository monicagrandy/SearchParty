System.register(['angular2/core', 'angular2/http'], function(exports_1, context_1) {
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
    var UrlService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            }],
        execute: function() {
            UrlService = (function () {
                function UrlService(_http) {
                    this._http = _http;
                    this.contentHeader = new http_1.Headers({ 'Content-Type': 'application/json' });
                    // change this URL when deploying
                    this.manualUrlToChange = 'http://localhost:8000/urlChecker';
                }
                UrlService.prototype.grabUrls = function () {
                    var _this = this;
                    console.log('called get req');
                    var httpGetPromise = new Promise(function (resolve, reject) {
                        console.log('inside get promise');
                        _this._http.get(_this.manualUrlToChange)
                            .map(function (res) { return res.json(); })
                            .subscribe(function (data) {
                            console.log('data from promise: ', data);
                            resolve(data);
                        }, function (err) {
                            reject(err);
                        }, function () { return console.log('data recieved'); });
                    });
                    return httpGetPromise;
                };
                UrlService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], UrlService);
                return UrlService;
            }());
            exports_1("UrlService", UrlService);
        }
    }
});
//# sourceMappingURL=url-service.js.map