const https = require('https')

// Add your Google Maps API Key to this file
const apikey = (require('./google_maps_api_key.json')).key

// Search for Places in a specified radius from the given location.
// searchRadius is in meters. There are about 1600 meters in a mile
async function placeNearbySearch(lat, long, searchRadius) {
    let DATA = {}

    let dataChunk = await httpsGetJson(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=${searchRadius}&key=${apikey}`)
    await collectData(dataChunk)

    // Collects data and adds to DATA
    async function collectData(dataChunk) {
        for(let eachPlace of dataChunk.results) {
            let placeID = eachPlace.place_id


            // If this place doesn't already exist in DATA
            // Gets place details, given a Place ID, and adds to DATA
            if(!DATA[placeID]) {
                let place = await httpsGetJson(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeID}&key=${apikey}`)
                // Don't collect data if place no longer exists
                if(!place.permanently_closed) {
                    let p = place.result
                    DATA[placeID] = {
                        "placeID": placeID,
                        "name": p.name,
                        "address": p.formatted_address,
                        "phone": p.formatted_phone_number,
                        "website": p.website,
                        "internationalPhone": p.international_phone_number,
                        "latitude": p.geometry.location.lat,
                        "longitude": p.geometry.location.lng,
                        "googlePage": p.url,
                        "hours": p.opening_hours,
                        "priceLevel": p.price_level,
                        "rating": p.rating,
                        "types": p.types,
                        "utcOffset": p.utc_offset,
                        "vicinity": p.vicinity
                    }
                }
            }
        }
        if(dataChunk.next_page_token) return continueSearch(dataChunk.next_page_token)
    }

    // Continues search if more than 20 results
    async function continueSearch(pagetoken) {
        console.log("Found more than 20 places. Continuing search...")
        wait(1500)
        let dataChunk = await httpsGetJson(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${apikey}&pagetoken=${pagetoken}`)
        await collectData(dataChunk)
    }
    return DATA
}

// Get request with given URL. Should return JSON, which is parsed and passed to the callback.
function httpsGetJson(url) {
    return new Promise(function(resolve, reject) {
        https.get(url, (response) => {
            response.setEncoding('utf8')
            let rawData = ''
            let parsedData
            response.on('data', (chunk) => { rawData += chunk; });
            response.on('end', () => {
                try {
                    parsedData = JSON.parse(rawData)
                } catch (e) {
                    console.error(e.message)
                }
                resolve(parsedData)
            })
        }).on('error', (error) => {
            reject(error)
        })
    })
}
 
async function main() {
    try {
        var quote = await getQuote();
        console.log(quote);
    } catch(error) {
        console.error(error);
    }
}

// Wait for x ms. Use with await in async funcs
function wait(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}



module.exports.placeNearbySearch = exports.placeNearbySearch = placeNearbySearch