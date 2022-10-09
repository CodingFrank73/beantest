
const nodeGeocoder = require('node-geocoder');

const options = {
    provider: 'openstreetmap'
};

const geocoder = nodeGeocoder(options);


// const getLocation = (latitude, longitude) => {

// }

async function getLocation(latitude, longitude) {

    const location = await geocoder.reverse({
        lat: latitude,
        lon: longitude
    })

    return location
}



// geocoder.geocode('an der bastion 3 köln')
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

module.exports = {
    getLocation
}