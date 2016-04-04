import {Pipe, ChangeDetectorRef, PipeTransform} from 'angular2/core';
import * as moment from 'moment';

// under systemjs, moment is actually exported as the default export, so we account for that
const momentConstructor: (value?: any) => moment.Moment = (<any>moment).default || moment;

@Pipe({ name: 'formatUnix', pure: false })
export class FromUnixPipe implements PipeTransform {
  private _currentTimer: any;

  constructor(private _cdRef: ChangeDetectorRef) {
  }

  transform(value: Date | moment.Moment, args?: any[]): any {
    const momentInstance = momentConstructor(value);
    return momentConstructor.unix(value).format('hh:mmA');
  }

}