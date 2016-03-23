'use strict'

describe('Search Party Login', () => {
   beforeEach(() => {
      browser.ignoreSynchronization = true;
   });

   it('should have a title', () => {
    expect(browser.getTitle()).toEqual('Search Party');
  });

   it('should be an ion app', () => {
     expect(element(by.css('ion-app')).isPresent()).toEqual(true);
   });

   it('should have a "nav" id', () => {
     expect(element(by.id('nav')).isPresent()).toEqual(true);
   });

   it('should have a ion items', () => {
     expect(element(by.css('ion-item')).isPresent()).toEqual(true);
   });

   it('should have an ion segment button whose value is "login"', () => {
     expect(element(by.css('ion-segment-button')).getText()).toEqual('Login');
   });

   // it('should have a name class', () => {
   //    // element(by.css('button')).click();
   //    // expect(element(by.css('button')).isPresent()).toEqual(true);
   //    expect(element.any(by.css('.show-menu')).isPresent()).toEqual(true);
   // })

   it('should have a class named item-inner', () => {
      // expect(element(by.css('ion-list')).isPresent()).toEqual(true);
      element.all(by.css('ion-list button')).then(function(items) {
         expect(items.length).toBe(4);
      })
   })

});


/*
<html>
	<head><!-- Include angularjs and all your awesome things--></head>
	<body>
		<p id='awesomeStatus'>I am not awesome</p>
		<button id='becomeAwesome'>Awesome</button>
	</body>
	<script type='text/javascript'>
		$('#becomeAwesome').on('click', function(){
			$('awesomeStatus').html('I am awesome')
		});
	</script>
</html>
*/

/*
describe('Becoming Awesome', function(){
        it('should start out not very awesome', function(){
                var awesomeStatus = element(by.id('awesomeStatus'));
                expect(awesomeStatus.getText()).toContain('I am not awesome');
        });
        it('should become awesome', function(){
                element(by.id('becomeAwesome')).click();
        });
        it('should be awesome', function(){
                var awesomeStatus = element(by.id('awesomeStatus'));
                expect(awesomeStatus.getText()).toContain('I am awesome');
        });
});
*/
