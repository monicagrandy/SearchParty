import {Pipe, PipeTransform} from 'angular2/core';

@Pipe(
  {name: 'HuntFilterPipe'}
)
export class HuntFilterPipe {
  transform(value, args) {
    // let filter = args;
    console.log("hunts??", value);
    // console.log("filter", filter);

    return value.filter(hunt => {
      console.log("does this hunt have feedback", hunt[args]);
      if (!hunt[args]) {
        return true;
      } else {
        return false;
      }
    })

  }
}
