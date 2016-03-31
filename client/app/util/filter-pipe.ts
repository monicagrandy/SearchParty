import {Pipe} from 'angular2/core';

@Pipe(
  {name: 'filterHunt'}
)
export class FilterPipe {
  transform(value, filters) {

    var filter = function(obj, filters) {
      return Object.keys(filters).every(prop => obj[prop] === filters[prop])
    }

    return value.filter(obj => filter(obj, filters[0]));
  }
}
