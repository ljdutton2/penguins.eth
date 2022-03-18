"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const querystring_1 = __importDefault(require("querystring"));
const logger_1 = require("../../../common/logger");
const http = require("http");
const LOCAL_LOGIN_PORT = 63081;
// Exporting for testing purposes
exports.handleResponseEnd = (body, nonce, res, onSuccess, onEnd) => {
    // Keys should be present in the body of the response
    const tokens = querystring_1.default.parse(body);
    if (tokens.state !== nonce) {
        // Tampering prevention
        throw new Error('Unexpected error while processing login flow');
    }
    // Render a self-closing website
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<html><body><script type="text/javascript">window.close();</script></body></html>');
    logger_1.Logger.log('Log in successful, getting user info...');
    onSuccess(tokens).then(onEnd);
};
const receiveOidcResponse = (onSuccess, nonce) => {
    const server = http
        .createServer((req, res) => {
        let body = '';
        req.on('data', data => {
            body += data;
        });
        req.on('end', () => {
            const onEnd = () => {
                res.end();
                server.close();
            };
            exports.handleResponseEnd(body, nonce, res, onSuccess, onEnd);
        });
    })
        .listen(LOCAL_LOGIN_PORT);
};
exports.default = receiveOidcResponse;
