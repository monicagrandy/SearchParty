import {Pipe, PipeTransform} from 'angular2/core';

@Pipe(
  {name: 'HuntFilterPipe'}
)
export class HuntFilterPipe implements PipeTransform{
  transform(value:any, args) {

    return value.filter(hunt => {

      let prop = hunt;

      for(let i = 0; i < args.length; i++) {
        if(prop[args[i]]) {
          prop = prop[args[i]];
        }
        else {
          return true;
        }
      }
      return false;
    })

  }
}

// Kyle 'The Fox' Kodani
