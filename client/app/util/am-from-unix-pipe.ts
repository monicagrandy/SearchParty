import {Pipe, PipeTransform} from 'angular2/core';
import * as moment from 'moment';

@Pipe({
  name: 'amFromUnix'
})
export class FromUnixPipe implements PipeTransform {
  transform(value: number, args: any[]) {
    console.log('this pie is going to return ', moment.unix(value).fromNow());
    return moment.unix(value).fromNow();
  }
}
