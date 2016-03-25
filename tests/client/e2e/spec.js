'use strict'
const webdriver = require('selenium-webdriver');

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
      element.all(by.css('#pTitles')).then((items) => {
         expect(items.length).toBe(4);
      });
   });

   it('should not have ion-cards', () => {
      expect(element(by.css('ion-card')).isPresent()).toEqual(false);
   });

   it('should prevent users from creating usernames that are already taken', () => {
      element(by.css('ion-segment-button[value="signup"]')).click();
      expect(element(by.css('form ion-item div ion-input [ngcontrol="firstname"]')).isPresent()).toEqual(true);
      expect(element(by.css('form ion-item div ion-input [ngcontrol="lastname"]')).isPresent()).toEqual(true);
      expect(element(by.css('form ion-item div ion-input [ngcontrol="username"]')).isPresent()).toEqual(true);
      expect(element(by.css('form ion-item div ion-input [ngcontrol="email"]')).isPresent()).toEqual(true);
      expect(element(by.css('form ion-item div ion-input [ngcontrol="password"]')).isPresent()).toEqual(true);
      browser.sleep(3000);
      element(by.css('form ion-item div ion-input [ngcontrol="firstname"]')).sendKeys('HACKER');
      element(by.css('form ion-item div ion-input [ngcontrol="lastname"]')).sendKeys('BOT');
      element(by.css('form ion-item div ion-input [ngcontrol="username"]')).sendKeys('HACKER BOT 3000');
      element(by.css('form ion-item div ion-input [ngcontrol="email"]')).sendKeys('all of your base are belong to me');
      element(by.css('form ion-item div ion-input [ngcontrol="password"]')).sendKeys('cam');
      // sendKeys('HACKER BOT 3000');
      // browser.sleep(5000);
      // expect(browser.getTitle()).toEqual('Search Party');
   });

   // it('should display the "Hunts" page after logging in', () => {
   //    expect(element(by.css('form ion-item div ion-input [ngcontrol="username"]')).isPresent()).toEqual(true);
   //    expect(element(by.css('form ion-item div ion-input [ngcontrol="password"]')).isPresent()).toEqual(true);
   //    expect(element(by.css('.login div form')).isPresent()).toEqual(true);
   //    element(by.css('form ion-item div ion-input [ngcontrol="username"]')).sendKeys('cam');
   //    element(by.css('form ion-item div ion-input [ngcontrol="password"]')).sendKeys('cam');
   //    element(by.css('.login div form')).submit();
   //    browser.sleep(7000);
   //    expect(browser.getTitle()).toEqual('Hunts');
   // });



});


/*
References:
https://github.com/lathonez/clicker
https://angular.github.io/protractor/#/api?view=ElementArrayFinder
http://learn.ionicframework.com/formulas/Protractor/
*/
