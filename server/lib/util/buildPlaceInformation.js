'use strict'

module.exports = {
  createSmallerPlaceObject: placeObj => {
    let smallerPlace = {
      name: placeObj.name,
      id: placeObj.id,
      lat: placeObj.coordinate.latitude,
      lng: placeObj.coordinate.longitude,
      address: placeObj.location.display_address[0] + ', ' + placeObj.location.display_address[2];
    };
    return smallerPlace;
  }
}
