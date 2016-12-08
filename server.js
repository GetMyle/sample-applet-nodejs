'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const Lout = require('lout');
const Vision = require('vision');
const Routes = require('./routes');

var config = {};
var server = new Hapi.Server(config);
server.connection({ port: 4000 });
server.register([Vision, Inert, Lout], (err) => {

    if (err) {
        console.error(err);
        process.exit(1);
    }

    server.route(Routes);

    server.views({
        engines: {
            html: require('handlebars')
        }
    });

    server.start(() => {
        console.log('Server running at:', server.info.uri);
    });
});