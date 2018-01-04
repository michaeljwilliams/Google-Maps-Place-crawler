console.log(`
+--------------------------------------+
| Welcome to Google Maps Place crawler |
|          by Michael Williams         |
+--------------------------------------+
`)
/* DIRECTIONS
 * This is the object exported by index.js. Here we will store it in the variable GoogleMapsPlaceCrawler
 * Cannot be const because it posesses the data container, which is manipulated
 */
let GoogleMapsPlaceCrawler = (require('./index')).GoogleMapsPlaceCrawler

// Set your Google Maps API key. You can do so with a JSON file, like this
GoogleMapsPlaceCrawler.apikey = (require('./google_maps_api_key.json')).key

// Further directions for usage are at the bottom



const util = require('util') // For inspecting objects

// Test function that does something with the data (displays Place names)
function tester() {
    // List the names of all the places
    console.log(`\nFound these places:\n`)
    for(let eachPlace in GoogleMapsPlaceCrawler.data) {
        console.log(util.inspect(GoogleMapsPlaceCrawler.data[eachPlace].name, false, null))
    }

    // console.log(`\n${util.inspect(GoogleMapsPlaceCrawler.data, false, null)}`) // Inspect the data object if you want.

    let numPlaces = Object.keys(GoogleMapsPlaceCrawler.data).length
    console.log(`\nFound ${numPlaces} places\n`)

    return GoogleMapsPlaceCrawler.data
}

console.log(`Using Google Maps API key: ${GoogleMapsPlaceCrawler.apikey}`)



//=================================================================================================
// DIRECTIONS CONTINUED

/* This package has two methods for you to use:
 * 1. GoogleMapsPlaceCrawler.placeNearbySearch
 *          This async function searches for Places in a specified radius from the given coordinates.
 *          This is limited to 60 results (because of how the API works).
 * 2. GoogleMapsPlaceCrawler.searchArea
 *          This async function runs placeNearbySearch many times in order to cover a large rectangular area.
 *          The search area is a rectangle defined by the start coordinates and the end coordinates, which are opposite 
 *          vertices on the diagonal of the rectangle. The start coordinates are the lower left vertex, and the end 
 *          coordinates are the upper right vertex.
 *          Remember to stay within your Google Maps API usage limits (if you get an error you might've exceeded the limit).
 *
 * All the data collected by both functions is stored in the GoogleMapsPlaceCrawler.data object
 */


/* placeNearbySearch example
 * This async function searches for Places in a specified radius from the given coordinates.
 * args: latitude, longitude, search radius (in meters; 1 mile ~ 1600 m)
 */
// GoogleMapsPlaceCrawler.placeNearbySearch(33.647862, -117.715524, 20).then(/* do something */ tester)

/* searchArea example
 * This async function runs placeNearbySearch many times in order to cover a large rectangular area.
 * args: start latitude, start longitude, end latitude, end longitude, search radius (meters)
 */
GoogleMapsPlaceCrawler.searchArea(33.638787, -117.724922, 33.640975, -117.722368, 100).then(tester)
