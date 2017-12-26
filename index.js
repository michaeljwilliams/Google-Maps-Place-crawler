var https = require('https')

//
const settings = require('./settings.json')
var data



function placeNearbySearch(location, numResults) {

}

function getPlaceDetails(placeid) {
    var parsedData = httpsGetJson(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeid}&key=${settings.googleMapsApiKey}`, (parsedData) => {
        console.log(parsedData)
    })
}

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



console.log(`
+--------------------------------------+
| Welcome to Google Maps Place crawler |
|          by Michael Williams         |
+--------------------------------------+
`)
getPlaceDetails("ChIJEwLrfRTo3IARBvSE67C43KQ")



module.exports = {

}