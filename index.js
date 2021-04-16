const express = require("express");
const app = express();
const port = 600;

var axios = require("axios");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => {
  var config = {
    method: "get",
    url: "https://rvcemeet1.cen.org.in/b/",
  };

  axios(config)
    .then(function (response) {
      cookie_data = response.headers["set-cookie"];
      config.url = "https://rvcemeet1.cen.org.in/b/signin";
      axios(config)
        .then((response) => {
          res_text = JSON.stringify(response.data);
          index = res_text.search("csrf-token") + 22;
          csrf_data = "";
          for (i = 0; i < 100; i++) {
            csrf_data += res_text[index + i];
          }
          pattern = /[A-Z,a-z,0-9,\=,\\,\/,\+]*==/g;
          csrf_token = csrf_data.match(pattern);
          csrf_token = csrf_token[0];
          cookie_data = cookie_data[0];
          body = { cookie_data, csrf_token };
          console.log(body);
          res.send(body);
        })
        .catch((error) => {
          console.log(error);
          res.send(error);
        });
    })
    .catch(function (error) {
      console.log(error);
      res.send(error);
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
