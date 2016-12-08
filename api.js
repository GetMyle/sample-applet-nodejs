'use strict';

const Request = require('request');
const Hawk = require('hawk');


const appCredentials = {
    id: <applet rdns>,
    key: <applet secret>,
    algorithm: 'sha256'
};


function makeRequest(options, credentials, callback) {
    const header = Hawk.client.header(options.url, options.method, { credentials: credentials, app: credentials.app });
    options.headers = options.headers || {};
    options.headers.Authorization = header.field;
    options.json = options.json || true;
    return Request(options, function (err, res, payload) {
        if (err) {
            return callback(err);
        }
        const isSuccess = (res.statusCode >= 200) && (res.statusCode < 300) || (res.statusCode === 304);
        if (!isSuccess) {
            return callback(new Error(payload.message));
        }
        callback(null, res, payload);
    });
}


module.exports = class Myle {

    constructor(isSandBox) {
        this.host = isSandBox ? 'https://dev.getmyle.com:444' : 'https://api.getmyle.com';
    }

    getTicket(session, cb) {
        makeRequest({ method: 'POST', url: `${this.host}/v1/ticket`, json: { session: session } }, appCredentials, (err2, res, userTicket) => {
            if (err2) {
                return cb(err2);
            }
            cb(null, userTicket);
        });
    }

    refreshTicket(ticket, cb) {
        makeRequest({ method: 'POST', url: `${this.host}/v1/ticket/refresh`, json: true }, ticket, (err2, res, userTicket) => {
            if (err2) {
                return cb(err2);
            }
            cb(null, userTicket);
        });
    }

    query(userTicket, query, cb) {
        makeRequest({ method: 'POST', url: `${this.host}/v1/query`, json: query }, userTicket, (err, res, payload) => {
            if (err) {
                return cb(err);
            }
            cb(null, payload);
        });
    }

};