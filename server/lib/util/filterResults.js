'use strict'


module.exports = {
  filterExisitingResults: (previousResults, currentResults) => {
    console.log("inside filter");
    console.log("+++currentResults ", currentResults);
    console.log("+++previousResults ", previousResults)

    let resultNames = []
    for(let i = 0; i < currentResults.length; i++){
      resultNames.push(currentResults[i].id)
    }

    console.log("+++resultNames ", resultNames)
    for(let index = 0; index < previousResults.length; index++) {
      console.log("+++inside for loop")
      console.log(previousResults[index].id);
      console.log("+++on line 23")
      console.log(resultNames[index]);
      let resultFoundIndex = resultNames.indexOf(previousResults[index].id);
      if(resultFoundIndex !== -1) {
        console.log("duplicate found", previousResults[index]);
        currentResults.splice(resultFoundIndex, 1);
      }
    }
    return currentResults;
  }

}
