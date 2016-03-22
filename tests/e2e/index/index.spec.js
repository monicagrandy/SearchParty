describe('hello-protractor', function () {
   var ptor = protractor.getInstance();

   describe('index', function() {
      it('should display the correct title', function () {
         ptor.get('/signup');
         expect(ptor.getTitle()).toBe('signup');
      });
   })
})
