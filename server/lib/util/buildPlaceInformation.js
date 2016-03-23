'use strict'

module.exports = {
  createSmallerPlaceObject: placeObj => {
    console.log("inside of the smaller object builder");
    let smallerObj = {};
      smallerObj.name = placeObj.name;
      smallerObj.id = placeObj.id;
      smallerObj.lat = placeObj.location.coordinate.latitude;
      smallerObj.lng = placeObj.location.coordinate.longitude;
      smallerObj.address = placeObj.location.display_address[0] + ', ' + placeObj.location.display_address[2];
      //
      // let smallerObj = {
      //   name: placeObj.name
      // }

    console.log("inside of smaller object builder (small)", smallerObj);
    return smallerObj;
  }
}
