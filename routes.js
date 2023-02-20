const express = require("express");
const router = express.Router();
const db = require("./db");

router.get("/users", async function (req, res, next) {
    try {
        // const { user_fav_color, dist, origin, min_age, max_age } = req.query;
        // const result = await db.query(
        //     'SELECT user_fav_color, dist, origin, min_age, max_age FROM users WHERE user_fav_color = $1',
        //     [user_fav_color]); 

        const { fav_color, dist } = req.query;
        // need to find the distance from lat/long or city entered to lat/long in db for each user in db & return results if <= dist
        const distFromMe = 100;
        const result = await db.query(
            'SELECT user_id, user_name, user_age, user_fav_color, lat, long FROM users WHERE user_fav_color != $1',
            [fav_color]);

        console.log(result.rows)

        /**  https://leafletjs.com/examples/geojson/)*/

        const metadata = {
            "path": "/users",
            "query": {
              "user_fav_color": fav_color,
            //   "dist": dist,
            //   "origin": origin,
            //   "min_age": min_age,
            //   "max_age": max_age
            }
          };
        
        const features = [];
        let results;

        if (result.rows.length > 1) {
            for (let row of result.rows) { console.log(row)
                const feature = {
                    "type": "Feature",
                    "properties": {
                      "city": row.last_location
                    },
                    "geometry": {
                      "type": "Point",
                      "coordinates": [row.lat, row.long]
                    }
                  }
                  features.push(feature);

                results = {
                    "type": "user",
                    "locationHistory": {
                        "type": "FeatureCollection",
                        "features": features
                    },
                    "properties": {
                        "id": row.user_id,
                        "name": row.user_name,
                        "age": row.user_age,
                        "fav_color": row.user_fav_color
                    }
                }
            } 
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