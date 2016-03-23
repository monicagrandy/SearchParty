'use strict'

describe('Search Party Login', () => {
   beforeEach(() => {
      browser.ignoreSynchronization = true;
   });

   it('should be an ion app', () => {
      expect(element(by.css('ion-app')).isPresent()).toEqual(true);
   });

   it('should have a title', () => {
      expect(browser.getTitle()).toEqual('Search Party');
   });

   it('should have a "nav" id', () => {
      expect(element(by.id('nav')).isPresent()).toEqual(true);
   });

   it('should have an ion segment button whose value is "Login"', () => {
      expect(element(by.css('ion-segment-button')).getText()).toEqual('Login');
   });

   it('should have 4 buttons in menu', () => {
      // expect(element(by.css('ion-list')).isPresent()).toEqual(true);
      element.all(by.css('#pTitles')).then(function(items) {
         expect(items.length).toBe(4);
      });
   });

});


/*
References:
https://github.com/lathonez/clicker
https://angular.github.io/protractor/#/api?view=ElementArrayFinder
http://learn.ionicframework.com/formulas/Protractor/
*/
