"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *   Wechaty - https://github.com/chatie/wechaty
 *
 *   @copyright 2016-2017 Huan LI <zixia@zixia.net>
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
const bodyParser = require("body-parser");
const events_1 = require("events");
const express = require("express");
const https = require("https");
const WebSocket = require("ws");
const config_1 = require("../config");
class Server extends events_1.EventEmitter {
    constructor(port) {
        super();
        this.port = port;
    }
    toString() { return `Server({port:${this.port}})`; }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('PuppetWebServer', `init() on port ${this.port}`);
            try {
                this.createExpress();
                yield this.createHttpsServer(this.express);
                this.createWebSocketServer(this.httpsServer);
                return;
            }
            catch (e) {
                config_1.log.error('PuppetWebServer', 'init() exception: %s', e.message);
                throw e;
            }
        });
    }
    /**
     * Https Server
     */
    createHttpsServer(expressApp) {
        return __awaiter(this, void 0, void 0, function* () {
            this.httpsServer = (yield new Promise((resolve, reject) => {
                const srv = https.createServer({
                    key: require('./ssl-pem').key,
                    cert: require('./ssl-pem').cert,
                }, expressApp); // XXX: is express must exist here? try to get rid it later. 2016/6/11
                srv.listen(this.port, err => {
                    if (err) {
                        config_1.log.error('PuppetWebServer', 'createHttpsServer() exception: %s', err);
                        return reject(err);
                    }
                    else {
                        config_1.log.verbose('PuppetWebServer', `createHttpsServer() listen on port ${this.port}`);
                        resolve(srv);
                    }
                });
            }));
            return this.httpsServer;
        });
    }
    /**
     * express Middleware
     */
    createExpress() {
        this.express = express();
        this.express.use(bodyParser.json());
        this.express.use(function (req, res, next) {
            // cannot use `*` if angular is set `.withCredentials = true`
            // see also: https://github.com/whatwg/fetch/issues/251#issuecomment-199946808
            // res.header('Access-Control-Allow-Origin', '*')
            res.header('Access-Control-Allow-Origin', req.headers['origin']);
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });
        this.express.get('/ding', function (req, res) {
            config_1.log.silly('PuppetWebServer', 'createexpress() %s GET /ding', new Date());
            res.end('dong');
        });
        return this.express;
    }
    /**
     * Socket IO
     */
    createWebSocketServer(httpsServer) {
        this.socketServer = new WebSocket.Server({
            server: httpsServer,
        });
        this.socketServer.on('connection', client => {
            config_1.log.verbose('PuppetWebServer', 'createWebSocketServer() got connection from browser');
            if (this.socketClient) {
                config_1.log.warn('PuppetWebServer', 'createWebSocketServer() on(connection) there already has a this.socketClient');
                this.socketClient = null; // close() ???
            }
            this.socketClient = client;
            this.initEventsFromClient(client);
        });
        return this.socketServer;
    }
    initEventsFromClient(client) {
        config_1.log.verbose('PuppetWebServer', 'initEventFromClient()');
        this.emit('connection', client);
        client.on('open', () => {
            config_1.log.silly('PuppetWebServer', 'initEventsFromClient() on(open) WebSocket opened');
        });
        client.on('close', e => {
            config_1.log.silly('PuppetWebServer', 'initEventsFromClient() on(disconnect) WebSocket disconnect: %s', e);
            // 1. Browser reload / 2. Lost connection(Bad network)
            this.socketClient = null;
            this.emit('disconnect', e);
        });
        client.on('error', e => {
            // log.error('PuppetWebServer', 'initEventsFromClient() client on error: %s', e)
            config_1.log.error('PuppetWebServer', 'initEventsFromClient() on(error): %s', e.stack);
        });
        client.on('message', data => {
            const obj = JSON.parse(data);
            this.emit(obj.name, obj.data);
        });
        return;
    }
    quit() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('PuppetWebServer', 'quit()');
            if (this.socketServer) {
                config_1.log.verbose('PuppetWebServer', 'closing socketServer');
                this.socketServer.close();
                this.socketServer = null;
            }
            if (this.socketClient) {
                config_1.log.verbose('PuppetWebServer', 'closing socketClient');
                this.socketClient = null;
            }
            if (this.httpsServer) {
                config_1.log.verbose('PuppetWebServer', 'closing httpsServer');
                this.httpsServer.close();
                this.httpsServer = null;
            }
            return;
        });
    }
}
exports.Server = Server;
exports.PuppetWebServer = Server;
exports.default = Server;
//# sourceMappingURL=server.js.map