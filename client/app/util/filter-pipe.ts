import {Pipe, PipeTransform} from 'angular2/core';

@Pipe(
  {name: 'HuntFilterPipe'}
)
export class HuntFilterPipe implements PipeTransform{
  transform(hunts: any, args: string[]): any {
    let filter = args[0];
    console.log("hunts??", hunts);
    console.log("filter", filter);
    return value.filter(hunt => {
      console.log("does this hunt have the feedback", hunt[filter]);
       if (!hunt[filter]) {
         return true;
       } else {
         return false;
       }
    })
  }
}
