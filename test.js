const util = require('util') // For inspecting objects

const placeNearbySearch = (require('./index')).placeNearbySearch
// Add your Google Maps API Key to this file
const apikey = (require('./google_maps_api_key.json')).key

console.log(`
+--------------------------------------+
| Welcome to Google Maps Place crawler |
|          by Michael Williams         |
+--------------------------------------+

Using Google Maps API key: ${apikey}
`)

placeNearbySearch(33.647862, -117.715524, 20).then( (DATA) => {
    /* List the names of all the places. Doesn't work for some reason (ReferenceError: name is not defined)
    for(let eachPlace in DATA) {
        console.log(util.inspect(DATA[eachPlace][name], false, null))
    }
    */
    console.log(`\n${util.inspect(DATA, false, null)}`)

    let numPlaces = Object.keys(DATA).length
    console.log(`\nFound ${numPlaces} places\n`)
    if(numPlaces === 60) console.log("Google has a limit of 60 results for each specific search. Change lat/lng to obtain more results.\n")
})