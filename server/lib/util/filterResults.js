'use strict'


module.exports = {
  filterExisitingResults: (previousResults, currentResults) => {

    let resultNames = currentResults.map(result => result.id);

    for(let index of previousResults) {
      let resultFoundIndex = resultNames.indexOf(previousResults[index].id);
      if(resultFoundIndex !== -1) {
        console.log("duplicate found", previousResults[index]);
        currentResults.splice(resultFoundIndex, 1);
      }
    }
    return currentResults;
  }

}
