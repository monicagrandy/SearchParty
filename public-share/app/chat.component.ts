import {Component, OnInit} from 'angular2/core';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS} from 'ng2-material/all';

@Component({
  selector: 'my-chat',
  templateUrl: './share/app/searchparty.component.html',
  styleUrls: ['./share/app/searchparty.component.css'],
  directives: [MATERIAL_DIRECTIVES],
  providers: [MATERIAL_PROVIDERS]
})
export class SearchPartyComponent {

  
  constructor() {
  } 

}
