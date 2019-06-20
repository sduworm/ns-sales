const request = require('request');
const {stringify} = require('query-string');

module.exports.httpGetAndRun = function (url, queryParams, cb) {
    request(`${url}?${stringify(queryParams)}`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            cb(JSON.parse(body));
        } else {
            console.error(error);
        }
    });
};

module.exports.httpRequestAndRun = function (url, requestData, cb) {
    request.post({url, form: requestData}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            cb(JSON.parse(body));
        } else {
            console.error(error);
        }
    })
};

module.exports.httpPost = function (url, requestData) {
    request({
        url,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        json: requestData
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        } else {
            console.error('Error', response.statusCode, error);
        }
    });
};
