// const protractor = require('protractor');
// console.log(protractor);
describe('Search Party Login', function () {
   it('should have a title', function() {
      browser.get('http://localhost:8000');
      expect(browser.getTitle()).toEqual('login');
   });
})
