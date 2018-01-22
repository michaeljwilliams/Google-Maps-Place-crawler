const https = require("https");

module.exports = exports = 
{   "apikey": ""
,   "logging": false
,   "data": {} // Stores all the data

    // Search for Places in a specified radius (meters) from the given coordinates.
,   "nearby": async function(lat, long, searchRadius) {
        if(this.logging === true) console.log("Searching new area...");
        let self = this;

        let dataChunk = await httpsGetJson(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=${searchRadius}&key=${self.apikey}`);
        await collectData(dataChunk);

        // Collects data and adds to DATA
        async function collectData(dataChunk) {
            for(let eachPlace of dataChunk.results) {
                let placeID = eachPlace.place_id;


                // If this place doesn't already exist in DATA
                // Gets place details, given a Place ID, and adds to DATA
                if(!self.data[placeID]) {
                    let place = await httpsGetJson(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeID}&key=${self.apikey}`);
                    // Don't collect data if place no longer exists
                    if(!place.permanently_closed) {
                        let p = place.result;
                        self.data[placeID] = 
                        {   "placeID": placeID
                        ,   "name": p.name
                        ,   "address": 
                            {   "full": p.formatted_address
                            ,   "components": p.address_components
                            }
                        ,   "website": p.website
                        ,   "phone": p.formatted_phone_number
                        ,   "internationalPhone": p.international_phone_number
                        ,   "latitude": p.geometry.location.lat
                        ,   "longitude": p.geometry.location.lng
                        ,   "googlePage": p.url
                        ,   "hours": p.opening_hours
                        ,   "priceLevel": p.price_level
                        ,   "rating": p.rating
                        ,   "types": p.types
                        ,   "utcOffset": p.utc_offset
                        ,   "vicinity": p.vicinity
                        };
                    }
                }
            }
            if(dataChunk.next_page_token) return continueSearch(dataChunk.next_page_token);
        }

        // Continues search if more than 20 results
        async function continueSearch(pagetoken) {
            if(self.logging === true) console.log("Found more than 20 places. Continuing search...");
            wait(1500);
            let dataChunk = await httpsGetJson(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${self.apikey}&pagetoken=${pagetoken}`);
            await collectData(dataChunk);
        }
    }

    /* This function will repeatedly run placeNearbySearch, which will search for places in a radius of searchRadius, 
     * beginning with the start set of coordinates. The search will be repeated until the search area is covered, in 
     * increments of (approximately) searchRadius meters (so that nothing is missed). The search area is a rectangle 
     * defined by the start coordinates and the end coordinates, which are opposite vertices on the diagonal of the 
     * rectangle. The start coordinates are the lower left vertex, and the end coordinates are the upper right vertex.
     *
     * In order to collect all the data, there should be less than 60 places within each circle defined by searchRadius 
     * and any set of coordinates within the search area.
     */
,   "area": async function(startLat, startLong, endLat, endLong, searchRadius) {
        let latIncrement = searchRadius * 0.00000904371733;
        let longIncrement = searchRadius * 0.00000898311175 / Math.cos(startLat * Math.PI / 180);

        for(let long = startLong; long <= endLong; long += longIncrement) {
            for(let lat = startLat; lat <= endLat; lat += latIncrement) {
                await this.nearby(lat, long, searchRadius);
            }
        }
    }

,   "placeNearbySearch": function(lat, long, searchRadius) {
        if(this.logging === true) {
            console.log(`\nUsing Google Maps API key: ${this.apikey}`);
            console.log(`Searching for places within ${searchRadius} meters of (${lat},${long})...\n`);
        }
        return this.nearby(lat, long, searchRadius).then(() => { return this.data; });
    }
,   "searchArea": function(startLat, startLong, endLat, endLong, searchRadius) {
        if(this.logging === true) {
            console.log(`\nUsing Google Maps API key: ${this.apikey}`);
            console.log(`Searching for places from (${startLat},${startLong}) to (${endLat},${endLong}) with search radius ${searchRadius} meters...\n`);
        }
        return this.area(startLat, startLong, endLat, endLong, searchRadius).then(() => { return this.data; });
    }
};



// UTILITIES

// Get request with given URL. Should return JSON, which is parsed and passed to the callback.
function httpsGetJson(url) {
    return new Promise(function(resolve, reject) {
        https.get(url, (response) => {
            response.setEncoding('utf8');
            let rawData = '';
            let parsedData;
            response.on('data', (chunk) => { rawData += chunk; });
            response.on('end', () => {
                try {
                    parsedData = JSON.parse(rawData);
                } catch (e) {
                    console.error(e.message);
                }
                resolve(parsedData);
            });
        }).on('error', (error) => {
            reject(error);
        })
    })
}

// Wait for x ms. Use with await in async funcs
function wait(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms);
    })
}
