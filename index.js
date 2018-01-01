var https = require('https')
const util = require('util') // For inspecting objects

// Add your Google Maps API Key to this file
const apikey = require('./google_maps_api_key.json')

var DATA = {}

// Search for Places in a specified radius from the given location.
// searchRadius is in meters. There are about 1600 meters in a mile
async function placeNearbySearch(lat, long, searchRadius) {
    let placeNumber = 1

    await httpsGetJson(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=${searchRadius}&key=${apikey.key}`,
        (dataChunk) => {
            collectData(dataChunk)
        })

    // Collects data and adds to DATA
    async function collectData(dataChunk) {
        for(let eachPlace of dataChunk.results) {
            let placeID = eachPlace.place_id
            console.log(`${placeNumber}. ${placeID}`)
            placeNumber++

            // If this place doesn't already exist in DATA
            if(!DATA.placeID) {
                // Gets place details, given a Place ID, and adds to DATA

                await httpsGetJson(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeID}&key=${apikey.key}`,
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
                        }
                        console.log(`${placeNumber}. ${DATA.name}`)
                    }
                )
            }
        }
        if(dataChunk.next_page_token) return continueSearch(dataChunk.next_page_token)
    }

    // Continues search if more than 20 results
    async function continueSearch(pagetoken) {
        wait(1500)
        await httpsGetJson(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${apikey.key}&pagetoken=${pagetoken}`,
            (dataChunk) => {
                collectData(dataChunk)
            })
    }
    return DATA
}

// Get request with given URL. Should return JSON, which is parsed and passed to the callback.
async function httpsGetJson(url, cb) {
    await https.get(url, (response) => {
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

placeNearbySearch(33.647862, -117.715524, 20)
// console.log(`\n\n\nDATA: \n\n${util.inspect(DATA, false, null)}`)

wait(5000).then( () => {
    console.log(`\n\n\nDATA: \n\n${util.inspect(DATA, false, null)}`)
})

module.exports = {

}