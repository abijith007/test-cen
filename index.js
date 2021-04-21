const express = require("express");
const app = express();
const port = 600;

var axios = require("axios");

function getIndicesOf(searchStr, str, caseSensitive) {
  var searchStrLen = searchStr.length;
  if (searchStrLen == 0) {
    return [];
  }
  var startIndex = 0,
    index,
    indices = [];
  if (!caseSensitive) {
    str = str.toLowerCase();
    searchStr = searchStr.toLowerCase();
  }
  while ((index = str.indexOf(searchStr, startIndex)) > -1) {
    indices.push(index);
    startIndex = index + searchStrLen;
  }
  return indices;
}

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
    url: "https://rvcemeet1.cen.org.in/b/signin",
  };

  axios(config)
    .then(function (response) {
      cookie_data = response.headers["set-cookie"];

      res_text = JSON.stringify(response.data);
      index = res_text.search("csrf-token") + 20;
      csrf_data = "";
      for (i = 0; i < 120; i++) {
        csrf_data += res_text[index + i];
      }
      //console.log(csrf_data);

      values = getIndicesOf("authenticity_token", res_text);
      authenticity_token = "";
      for (i = values[1] + 25; i < 130 + values[1]; i++) {
        authenticity_token += res_text[i];
      }
      console.log(authenticity_token);
      pattern = /[A-Z,a-z,0-9,\=,\\,\/,\+]*==/g;

      authenticity_token = authenticity_token.match(pattern);
      console.log(authenticity_token);
      csrf_token = csrf_data.match(pattern);
      csrf_token = csrf_token[0];
      cookie_data = cookie_data[0];
      body = { cookie_data, csrf_token, authenticity_token };
      console.log(body);
      res.send(body);
    })
    .catch(function (error) {
      console.log(error);
      res.send(error);
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
