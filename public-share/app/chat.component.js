System.register(['angular2/core', 'ng2-material/all'], function(exports_1, context_1) {
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
    var core_1, all_1;
    var SearchPartyComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (all_1_1) {
                all_1 = all_1_1;
            }],
        execute: function() {
            SearchPartyComponent = (function () {
                function SearchPartyComponent() {
                }
                SearchPartyComponent = __decorate([
                    core_1.Component({
                        selector: 'my-chat',
                        templateUrl: './share/app/searchparty.component.html',
                        styleUrls: ['./share/app/searchparty.component.css'],
                        directives: [all_1.MATERIAL_DIRECTIVES],
                        providers: [all_1.MATERIAL_PROVIDERS]
                    }), 
                    __metadata('design:paramtypes', [])
                ], SearchPartyComponent);
                return SearchPartyComponent;
            }());
            exports_1("SearchPartyComponent", SearchPartyComponent);
        }
    }
});
//# sourceMappingURL=chat.component.js.map