var https = require('https')

//
const settings = require('./settings.json')
var data



// Search for Places in a specified radius from the given location.
// searchRadius is in meters. There are about 1600 meters in a mile
function placeNearbySearch(lat, long, searchRadius) {
    var data = {}
    var i = 1

    httpsGetJson(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=${searchRadius}&key=${settings.googleMapsApiKey}`,
        (dataChunk) => {
            collectData(dataChunk)
            if(dataChunk.next_page_token) continueSearch(dataChunk.next_page_token)
        })

    function collectData(dataChunk) {
        // EXTRACT DESIRED DATA, THEN ADD TO data
        // data += dataChunk
        console.log(dataChunk)
        console.log(`\n\n\nPage ${i}\n\n\n`); i++
    }

    async function continueSearch(pagetoken) {
        await wait(1500)
        httpsGetJson(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${settings.googleMapsApiKey}&pagetoken=${pagetoken}`,
            (dataChunk) => {
                collectData(dataChunk)
                if(dataChunk.next_page_token) continueSearch(dataChunk.next_page_token)
            })
    }
}

// Gets place details, given a Place ID
function getPlaceDetails(placeid) {
    httpsGetJson(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeid}&key=${settings.googleMapsApiKey}`,
        (data) => {
            console.log(data)
        })
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
//getPlaceDetails("ChIJEwLrfRTo3IARBvSE67C43KQ")



module.exports = {

}