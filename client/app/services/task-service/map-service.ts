import { Injectable, OnInit } from 'angular2/core';
//import google-maps


//set injectable
@Injectable({
  export class GoogleMap {
    constructor(){
      this.map = null;
      this.loadMap;
    }
  }
}) 


//make map