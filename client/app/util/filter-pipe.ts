import {Pipe, PipeTransform} from 'angular2/core';

@Pipe(
  {name: 'HuntFilterPipe'}
)
export class HuntFilterPipe implements PipeTransform {
  transform(value:any, args) {
    if(value) {
      return value.filter(hunt => {
        if(hunt.feedback.value == args) {
          return true;
        } else {
          return false;
        }
      });
    }
  }
}

// Kyle 'The Fox' Kodani
