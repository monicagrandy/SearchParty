'use strict'

module.exports = {
   unix: (timeInput) => {
      console.log('timeInput: ', timeInput);
      var result = Date.parse(timeInput);
      console.log('result: ', result);
      return result;
   }
}
