const csv = require('csvtojson');
const geolib = require('geolib');

csv({ delimiter: '\t' })
  .fromFile('./country-coords.csv')
  .then(codes => {
    console.log(
      codes
        .filter(c => c.latitude !== '')
        .map(c => ({
          code: c.country,
          distance: geolib.getDistance(
            { latitude: 61.92411, longitude: 25.748151 },
            {
              latitude: parseFloat(c.latitude, 10),
              longitude: parseFloat(c.longitude, 10)
            }
          )
        }))
        .reduce(
          (acc, cur) =>
            Object.assign(acc, { [cur.code]: Math.round(cur.distance / 1000) }),
          {}
        )
    );
  });
