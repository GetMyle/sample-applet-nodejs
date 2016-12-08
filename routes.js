'use strict';

const Joi = require('joi');
const Api = require('./api');

module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            const myle = new Api(request.query.sandbox);
            myle.getTicket(request.query.session, (e, ticket) => {
                if (e) {
                    return reply.view('index.html', {
                        error: e.stack
                    });
                }
                myle.query(ticket, {
                    sets: ['master'],
                    select: ['phrase', 'time'],
                    orderBy: [{ $desc: "time" }]
                }, (e, result) => {
                    reply.view('index.html', {
                        error: e && e.stack,
                        records: result
                    });
                });
            });
        }
    },
    {
        method: 'POST',
        path: '/hook',
        handler: function (request, reply) {
            const myle = new Api(request.query.sandbox);
            myle.getTicket(request.query.session, (e, ticket) => {
                if (e) {
                    console.error(e);
                    return reply(e);
                }
                console.log('record', JSON.stringify(request.payload));
            });
        }
    }
];