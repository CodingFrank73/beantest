
const Location = require('../../utils/location')

async function getLocation(latitude, longitude) {
    const result = Location.getLocation(latitude, longitude)

    return result
}

module.exports = {
    getLocation
}