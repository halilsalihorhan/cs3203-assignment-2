/**
 * Author: Halil Salih Orhan
 *
 * A simple CRUD API for mock twitter data
 *
 * Used functional programming concept for iterating and manuplating the data
 * It makes the code readable
 * So commentted logic is confusing and unneccessary for this code
 *
 * please do not forget to use node 12
 *
 *
 */

// imports
const fs = require("fs");
const bodyParser = require("body-parser");
const express = require("express");

// globals
const PORT = 3000;

//initialization of express
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//returns all tweets meta data
app.get("/tweets", async (req, res) => {
  let result;
  await fs.readFile("./favs.json", (err, data) => {
    result = JSON.parse(data).map((fav) => {
      return { created_at: fav.created_at, text: fav.text };
    });
    res.send(result);
  });
});

// returns user id's of all tweets.
app.get("/users", async (req, res) => {
  let result;
  await fs.readFile("./favs.json", (err, data) => {
    result = JSON.parse(data).map((fav) => {
      return fav.user.id;
    });
    res.send(result);
  });
});

// returns the first tweet which has given id in favs.json
app.get("/tweets/:id", async (req, res, next) => {
  await fs.readFile("./favs.json", async (err, data) => {
    const given = await JSON.parse(data).filter((fav) => {
      return req.params.id == fav.id;
    });
    if (given[0]) {
      const result = { created_at: given[0].created_at, text: given[0].text };
      res.send(result);
    } else {
      res.status(404).send("Not be found");
    }
  });
});

// add favs.json a new tweet with given id and text
app.post("/post", async (req, res) => {
  const json = await JSON.parse(fs.readFileSync("./favs.json"));
  json.push({
    created_at: Date(Date.now()),
    id: parseInt(req.body.id),
    id_str: req.body.id,
    text: req.body.text,
    source: "web",
    truncated: false,
    in_reply_to_status_id: null,
    in_reply_to_status_id_str: null,
    in_reply_to_user_id: null,
    in_reply_to_user_id_str: null,
    in_reply_to_screen_name: null,
    user: {
      id: 0,
      id_str: "0",
      name: "Test Test",
      screen_name: "test-test",
      location: "",
      description: "test",
      url: "example.com",
      entities: {
        url: {
          urls: [
            {
              url: "http://example.com",
              expanded_url: null,
              indices: [0, 18],
            },
          ],
        },
        description: {
          urls: [],
        },
      },
      protected: false,
      followers_count: 419,
      friends_count: 166,
      listed_count: 25,
      created_at: Date.now().toLocaleString(),
      favourites_count: 0,
      utc_offset: -18000,
      time_zone: "Eastern Time (US & Canada)",
      geo_enabled: false,
      verified: false,
      statuses_count: 2096,
      lang: "en",
      contributors_enabled: false,
      is_translator: false,
      profile_background_color: "424242",
      profile_background_image_url: "",
      profile_background_image_url_https: "",
      profile_background_tile: false,
      profile_image_url: "",
      profile_image_url_https: "",
      profile_banner_url:
        "https://si0.twimg.com/profile_banners/2408481/1361249325",
      profile_link_color: "424242",
      profile_sidebar_border_color: "424242",
      profile_sidebar_fill_color: "424242",
      profile_text_color: "000000",
      profile_use_background_image: false,
      default_profile: true,
      default_profile_image: true,
      following: null,
      follow_request_sent: false,
      notifications: null,
    },
    geo: null,
    coordinates: null,
    place: null,
    contributors: null,
    retweet_count: 1,
    entities: null,
    favorited: false,
    retweeted: false,
    possibly_sensitive: false,
    lang: "en",
  });
  await fs.writeFileSync("./favs.json", JSON.stringify(json, null, 2));
  res.sendStatus(200);
});

//changes given user screen name by given updated user name on all tweets
app.post("/change", async (req, res) => {
  const json = await JSON.parse(fs.readFileSync("./favs.json"));
  json.map((fav) => {
    if (fav.user.screen_name === req.body.screen_name) {
      fav.user.screen_name = req.body.updated_screen_name;
    }
    return fav;
  });
  await fs.writeFileSync("./favs.json", JSON.stringify(json, null, 2));
  res.sendStatus(200);
});

//filters tweets which have given tweet id in the body of the request
app.post("/delete", async (req, res) => {
  const json = await JSON.parse(fs.readFileSync("./favs.json"));
  const filtered = json.filter((fav) => fav.id != req.body.id);
  await fs.writeFileSync("./favs.json", JSON.stringify(filtered, null, 2));
  res.sendStatus(200);
});

//initialize express server on the port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
