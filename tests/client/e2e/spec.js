'use strict'
const webdriver = require('selenium-webdriver');

describe('Search Party Login', () => {
   beforeEach(() => {
      browser.ignoreSynchronization = true;
   });


   //Monica's Tetss
   it('should be an ion app', () => {
      expect(element(by.css('ion-app')).isPresent()).toEqual(true);
   });

   it('should have a title', () => {
      expect(browser.getTitle()).toEqual('Search Party');
   });

   it('should have a "nav" id', () => {
      expect(element(by.id('nav')).isPresent()).toEqual(true);
   });

   //Cameron's Tests
   it('should have an ion segment button whose value is "Login"', () => {
      expect(element(by.css('ion-segment-button')).getText()).toEqual('Login');
   });

   it('should have 4 buttons in menu', () => {
      element.all(by.css('#pTitles')).then((items) => {
         expect(items.length).toBe(4);
      });
   });

   it('should not have ion-cards', () => {
      expect(element(by.css('ion-card')).isPresent()).toEqual(false);
   });

   it('should work while trying to login', () => {
      expect(element(by.css('form ion-item div ion-input [ngcontrol="username"]')).isPresent()).toEqual(true);
      expect(element(by.css('form ion-item div ion-input [ngcontrol="password"]')).isPresent()).toEqual(true);
      expect(element(by.css('.login div form')).isPresent()).toEqual(true);
      element(by.css('form ion-item div ion-input [ngcontrol="username"]')).sendKeys('cam');
      element(by.css('form ion-item div ion-input [ngcontrol="password"]')).sendKeys('cam');
      element(by.css('.login div form')).submit();
      // browser.pause();
      expect(browser.getTitle()).toEqual('Hunts');
   });



   // it('should navigate through pages correctly', () => {
   //    element(by.css('#pTitles')).click();
   //    expect(browser.getTitle()).toEqual('Hunts');
   // });
});


/*
References:
https://github.com/lathonez/clicker
https://angular.github.io/protractor/#/api?view=ElementArrayFinder
http://learn.ionicframework.com/formulas/Protractor/
*/
