const express = require("express");
const router = express.Router();
const db = require("./db");

router.get("/users", async function (req, res, next) {
    try {
        const { fav_color, min_age, max_age } = req.query;
        // need to find the distance from lat/long or city entered to lat/long in db for each user in db & return results if <= dist
        const distFromMe = 100;

        // Haversine formula script credit: Harry Mumford-Turner, https://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript
        /**
           * Calculates the haversine distance between point A, and B.
           * @param {number[]} latlngA [lat, lng] point A
           * @param {number[]} latlngB [lat, lng] point B
           * @param {boolean} isMiles If we are using miles, else km.
           */
        const haversineDistance = ([lat1, lon1], [lat2, lon2], isMiles = true) => {
        const toRadian = angle => (Math.PI / 180) * angle;
        const distance = (a, b) => (Math.PI / 180) * (a - b);
        const RADIUS_OF_EARTH_IN_KM = 6371;

        const dLat = distance(lat2, lat1);
        const dLon = distance(lon2, lon1);

        lat1 = toRadian(lat1);
        lat2 = toRadian(lat2);

        // Haversine Formula
        const a =
          Math.pow(Math.sin(dLat / 2), 2) +
          Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.asin(Math.sqrt(a));

        let finalDistance = RADIUS_OF_EARTH_IN_KM * c;

        if (isMiles) {
          finalDistance /= 1.60934;
        }

        return finalDistance;
        };

        const result = await db.query(
            'SELECT user_id, user_name, user_age, user_fav_color, last_location, lat, long FROM users WHERE user_fav_color = $1 AND user_age >= $2 AND user_age <= $3',
            [fav_color, min_age, max_age]);

        for (let row of result.rows) {
          console.log("LAT:", row.lat, "LONG:", row.long);
        }

        /**  https://leafletjs.com/examples/geojson/)*/

        // This works well EXCEPT when multiple locations exist for single user; then we get same user listed twice.
        const metadata = {
            "path": "/users",
            "query": {
              "user_fav_color": fav_color,
            //   "dist": dist,
            //   "origin": origin,
              "min_age": min_age,
              "max_age": max_age
            }
          };
        
        const results =[];
        
        for (let row of result.rows) { 
          const { user_id, user_name, user_age, user_fav_color, last_location, lat, long } = row;

          // const feature = {
          //     "type": "Feature",
          //     "properties": {
          //       "city":last_location
          //     },
          //     "geometry": {
          //       "type": "Point",
          //       "coordinates": [lat, long]
          //     }
          //   }
          //   features.push(feature);

          results.push(
            {"type": "user",
            "locationHistory": {
              "type": "FeatureCollection",
              "features":
              [
                {
                  "type": "Feature",
                  "properties": {
                    "city": last_location
                  },
                  "geometry": {
                    "type": "Point",
                    "coordinates": [lat,long]
                  }
                }
              ]
            },
            "properties":
              {
                "id": user_id,
                "name": user_name, 
                "age": user_age,
                "fav_color": user_fav_color
              }
          });
        }       

        return res.json({
            "metadata": metadata,
            "num_results": result.rows.length,
            "results": results
          });
    }
    catch (err) {
        return next(err);
    }
});

module.exports = router;