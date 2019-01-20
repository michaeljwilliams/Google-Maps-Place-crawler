# Google Maps Place crawler

Node.js script that uses the Google Places API to programmatically retrieve and compile a list of Places (e.g. businesses) in a given area. Data can include place/business name, address, website, phone number, latitude/longitude, and more. With this script you can retrieve data on **any number** of places, up to the limit of your Google Maps API key.

See it on npm: [npmjs.com/package/google-maps-place-crawler](https://www.npmjs.com/package/google-maps-place-crawler)

## Usage

Install from npm:

    $ npm install google-maps-place-crawler

Require the package. Here we will store it in the variable GoogleMapsPlaceCrawler.

    const GoogleMapsPlaceCrawler = require('google-maps-place-crawler')

Set your Google Maps API key in the same object:

    GoogleMapsPlaceCrawler.apikey = 'YOUR_API_KEY'

Go here to set up your key: https://developers.google.com/places/web-service/

<br>

You have two methods you can use:

**Nearby search**

    placeNearbySearch(latitude, longitude, search radius)

This async function searches for Places in a specified radius from the given coordinates. It can return up to 60 places (this limit is due to the Places API). Search radius should be in meters. 1 mile ~ 1600m.

Example:

    GoogleMapsPlaceCrawler.placeNearbySearch(33.640864, -117.720336, 50).then((data) => {
        // do something with data
        console.log(data);
    });
       
<br>

**Area search**

    searchArea(start latitude, start longitude, end latitude, end longitude, search radius)

This async function runs placeNearbySearch many times in order to cover a large rectangular area. Search radius should be in meters.

Example:

    GoogleMapsPlaceCrawler.searchArea(33.638684, -117.721065, 33.641078, -117.719273, 100).then((data) => {
        // do something with data
        console.log(data);
    });

The search area is a rectangle defined by the start coordinates and the end coordinates, which are opposite vertices on the diagonal of the rectangle. The start coordinates are the lower left vertex, and the end coordinates are the upper right vertex.

In this function the search radius should reflect the expected density of Places in the area. If there are more than 60 Places within one of the searches done by placeNearbySearch (i.e. search radius is too large), the rest of the Places will not be captured in that search. You would also not want to set this value too low, because that will make the script take longer and use more requests of the Google API. I think 100 meters is a good, safe value for an area that might be dense with Places.

### Instructions and example usage are also given in help.js
