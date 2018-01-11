# Google Maps Place crawler

Node.js script that uses the Google Places API to programmatically retrieve and compile a list of Places (e.g. businesses) in a given area. Data can include place/business name, address, website, phone number, latitude/longitude, and more. With this script you can retrieve data on **any number** of places, up to the limit of your Google Maps API key.

## Usage
Get the GoogleMapsPlaceCrawler object exported by the package. Here we will store it in the variable GoogleMapsPlaceCrawler. Do not use const because the object is manipulated by the script.

    let GoogleMapsPlaceCrawler = require('Google-Maps-Place-crawler')

Set your Google Maps API key in the same object:

    GoogleMapsPlaceCrawler.apikey = 'YOUR_API_KEY'

Go here to set up your key: https://developers.google.com/places/web-service/

<br>

You have two methods you can use:

**Nearby search**

    placeNearbySearch(latitude, longitude, search radius)

This async function searches for Places in a specified radius from the given coordinates. It can return up to 60 places (this limit is due to the Places API). Search radius should be in meters. 1 mile ~ 1600m.

Example:

    GoogleMapsPlaceCrawler.placeNearbySearch(33.647862, -117.715524, 20).then(/* do something */)
       
<br>

**Area search**

    searchArea(start latitude, start longitude, end latitude, end longitude, search radius)

This async function runs placeNearbySearch many times in order to cover a large rectangular area. Search radius should be in meters.

Example:

    GoogleMapsPlaceCrawler.searchArea(33.638787, -117.724922, 33.640975, -117.722368, 100).then(/* do something */)

The search area is a rectangle defined by the start coordinates and the end coordinates, which are opposite vertices on the diagonal of the rectangle. The start coordinates are the lower left vertex, and the end coordinates are the upper right vertex.
### Instructions and example usage are also given in help.js
