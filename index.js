var https = require('https')
const util = require('util') // For inspecting objects

// Add your Google Maps API Key to this file
const apikey = require('./google_maps_api_key.json.json')
var DATA = {}



// Search for Places in a specified radius from the given location.
// searchRadius is in meters. There are about 1600 meters in a mile
function placeNearbySearch(lat, long, searchRadius) {
    var placeNumber = 1

    httpsGetJson(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=${searchRadius}&key=${apikey.key}`,
        (dataChunk) => {
            collectData(dataChunk)
        })

    // Collects data and adds to DATA
    function collectData(data) {
        for(let eachPlace of data.results) {
            let placeID = eachPlace.place_id
            // If this place doesn't already exist in DATA
            if(!DATA.placeID) {
                // Gets place details, given a Place ID, and adds to DATA
                httpsGetJson(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeID}&key=${apikey.key}`,
                (place) => {
                    // Don't collect data if place no longer exists
                    if(!place.permanently_closed) {
                        let p = place.result
                        DATA.placeID = {
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
                        console.log(`${placeNumber}. ${DATA.placeID.name}`)
                        placeNumber++
                    }
                })
            }
        }
        // await?   if(data.next_page_token) continueSearch(data.next_page_token)
    }

    // Continues search if more than 20 results
    async function continueSearch(pagetoken) {
        await wait(1500)
        httpsGetJson(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${apikey.key}&pagetoken=${pagetoken}`,
            (dataChunk) => {
                console.log(`dataChunk: ${dataChunk}`)
                collectData(dataChunk)
            })
    }
}

// Get request with given URL. Should return JSON, which is parsed and passed to the callback.
function httpsGetJson(url, cb) {
    https.get(url, (response) => {
        const { statusCode } = response
        const contentType = response.headers['content-type']

        let error
        if (statusCode !== 200) {
            error = new Error(`Request Failed. Status Code: ${statusCode}`)
        } else if (!/^application\/json/.test(contentType)) {
            error = new Error(`Invalid content-type. Expected application/json but received ${contentType}`)
        }
        if (error) {
            console.error(error.message)
            // consume response data to free up memory
            response.responseume()
            return
        }

        response.setEncoding('utf8')
        let rawData = ''
        response.on('data', (chunk) => { rawData += chunk; });
        response.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData)
                cb(parsedData)
            } catch (e) {
                console.error(e.message)
            }
        })
    }).on('error', (e) => {
        console.error(`Error: ${e.message}`)
    })
}

// Wait for x ms. Use with await in async funcs
function wait(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}



console.log(`
+--------------------------------------+
| Welcome to Google Maps Place crawler |
|          by Michael Williams         |
+--------------------------------------+
`)

placeNearbySearch(33.647862, -117.715524, 1000)
// console.log(`\n\n\nDATA: \n\n${util.inspect(DATA, false, null)}`)



module.exports = {

}