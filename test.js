const util = require('util') // For inspecting objects

// Not const because it posesses the data container, which is manipulated
let GoogleMapsPlaceCrawler = (require('./index')).GoogleMapsPlaceCrawler

// Add your Google Maps API Key to this file
const apikey = (require('./google_maps_api_key.json')).key



// Test function that does something with the data (displays Place names)
function tester() {
    // List the names of all the places
    console.log(`\nFound these places:\n`)
    for(let eachPlace in GoogleMapsPlaceCrawler.data) {
        console.log(util.inspect(GoogleMapsPlaceCrawler.data[eachPlace].name, false, null))
    }

    console.log(`\n${util.inspect(GoogleMapsPlaceCrawler.data, false, null)}`)

    let numPlaces = Object.keys(GoogleMapsPlaceCrawler.data).length
    console.log(`\nFound ${numPlaces} places\n`)

    return GoogleMapsPlaceCrawler.data
}



console.log(`
+--------------------------------------+
| Welcome to Google Maps Place crawler |
|          by Michael Williams         |
+--------------------------------------+

Using Google Maps API key: ${apikey}
`)

// placeNearbySearch example
// args: latitude, longitude, search radius (meters)
// GoogleMapsPlaceCrawler.placeNearbySearch(33.647862, -117.715524, 20).then(tester())

// searchArea example
// args: start latitude, start longitude, end latitude, end longitude, search radius (meters)
GoogleMapsPlaceCrawler.searchArea(33.638787, -117.724922, 33.641797, -117.721081, 100).then(tester())
