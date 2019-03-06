const fs = require("fs");

console.log(`
+--------------------------------------+
| Welcome to Google Maps Place crawler |
|          by Michael Williams         |
+--------------------------------------+`);

// DIRECTIONS
// Require the module.
const GoogleMapsPlaceCrawler = require('./index');

// Set your Google Maps API key. 
// GoogleMapsPlaceCrawler.apikey = 'YOUR_API_KEY';
// You can also set it with a JSON file, like below. This is useful because you can put the key file in your .gitignore
GoogleMapsPlaceCrawler.apikey = (require('./google_maps_api_key.json')).key;
// Enable logging if you want.
GoogleMapsPlaceCrawler.logging = true;



/* This package has two methods for you to use:
 *
 * 1. placeNearbySearch(lat, long, searchRadius)
 *          This async function searches for Places in a specified radius from the given coordinates.
 *          This is limited to 60 results (because of how the API works).
 * 
 * 2. searchArea(startLat, startLong, endLat, endLong, searchRadius)
 *          This async function runs placeNearbySearch many times in order to cover a large rectangular area.
 *          The search area is a rectangle defined by the start coordinates and the end coordinates, which are opposite 
 *          vertices on the diagonal of the rectangle. The start coordinates are the lower left vertex, and the end 
 *          coordinates are the upper right vertex.
 *          Remember to stay within your Google Maps API usage limits (if you get an error you might've exceeded the limit).
 */



/* placeNearbySearch example (Uncomment to try it.)
 * This async function searches for Places in a specified radius from the given coordinates.
 * args: latitude, longitude, search radius (in meters; 1 mile ~ 1600 m)
 */
/*
GoogleMapsPlaceCrawler.placeNearbySearch(33.640864, -117.720336, 50).then((data) => {
    // do something with data
    console.log("\nRESULTS:\n");
    //console.log(data);
    console.log(`\nFound ${Object.keys(data).length} places\n`);
    fs.writeFileSync("./Place-data.json", JSON.stringify(data, null, 4), "utf8");
    console.log(`\nResult written to ${__dirname}/Place-data.json.`);
});
*/

/* searchArea example
 * This async function runs placeNearbySearch many times in order to cover a large rectangular area.
 * args: start latitude, start longitude, end latitude, end longitude, search radius (meters)
 */ 

GoogleMapsPlaceCrawler.searchArea(33.638684, -117.721065, 33.641078, -117.719273, 100).then((data) => {
    // do something with data
    console.log("\nRESULTS:\n");
    console.log(data);
    console.log(`\nFound ${Object.keys(data).length} places\n`);
    fs.writeFileSync("./Place-data.json", JSON.stringify(data, null, 4), "utf8");
    console.log(`\nResult written to ${__dirname}/Place-data.json.`);
});

