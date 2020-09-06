const constants = require("./constants");
const http = require('http');
const querystring = require('querystring');
module.exports = (endpoint, method, data, success) => {
    var options = {
        "method": method,
        "hostname": constants.HOSTNAME,
        "port": constants.PORT,
        "path": endpoint,
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        }
    };

    var req = http.request(options, function (res) {
        var chunks = [];
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });
        res.on("end", function () {
            var body = Buffer.concat(chunks);
            // console.log(body.toString());
            success(body.toString())
        });
    });
    req.write(querystring.stringify(data));
    req.end();
}