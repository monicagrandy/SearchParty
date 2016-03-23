'use strict'


module.exports = {
  filterExisitingResults: (previousResults, currentResults) => {
    console.log("inside filter");
    // console.log("currentResults", currentResults);
    let resultNames = currentResults.map(result => result.id);

    for(let index of previousResults) {
      console.log(previousResults[index].id);
      console.log(resultNames[index].id);
      let resultFoundIndex = resultNames.indexOf(previousResults[index].id);
      if(resultFoundIndex !== -1) {
        console.log("duplicate found", previousResults[index]);
        currentResults.splice(resultFoundIndex, 1);
      }
    }
    return currentResults;
  }

}
