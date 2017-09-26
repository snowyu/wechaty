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
const ava_1 = require("ava");
const sinon_1 = require("sinon");
const _1 = require("../../");
const puppet_web_1 = require("../../src/puppet-web");
const bridge_1 = require("../../src/puppet-web/bridge");
/**
 * the reason why use `test.serial` here is:
 *  static variable `Contact.puppet` will be changed
 *  when `PuppteWeb.init()` and `PuppteWeb.quit()`
 */
ava_1.test.serial('login/logout events', (t) => __awaiter(this, void 0, void 0, function* () {
    const STUB_INIT_BROWSER = sinon_1.stub(puppet_web_1.default.prototype, 'initBrowser');
    STUB_INIT_BROWSER.resolves({
        clickSwitchAccount: () => false,
    });
    const STUB_BRIDGE_INIT = sinon_1.stub(bridge_1.Bridge.prototype, 'init');
    STUB_BRIDGE_INIT.resolves();
    const STUB_QUIT = sinon_1.stub(puppet_web_1.default.prototype, 'quit');
    STUB_QUIT.resolves();
    const STUB_CONTACT_FIND_ALL = sinon_1.stub(_1.Contact, 'findAll');
    STUB_CONTACT_FIND_ALL.onFirstCall().resolves([]);
    STUB_CONTACT_FIND_ALL.onSecondCall().resolves([1]);
    STUB_CONTACT_FIND_ALL.onThirdCall().resolves([1, 2]);
    STUB_CONTACT_FIND_ALL.resolves([1, 2, 3]);
    const STUB_BRIDGE_GET_USER_NAME = sinon_1.stub(bridge_1.Bridge.prototype, 'getUserName');
    STUB_BRIDGE_GET_USER_NAME.resolves('mockedUserName');
    // pw.bridge.getUserName = function() { return Promise.resolve('mockedUserName') }
    const STUB_GET_CONTACT = sinon_1.stub(puppet_web_1.default.prototype, 'getContact');
    STUB_GET_CONTACT.resolves('dummy');
    // pw.getContact = function() { return Promise.resolve('dummy') }
    try {
        const pw = new puppet_web_1.default();
        t.truthy(pw, 'should instantiated a PuppetWeb');
        _1.config.puppetInstance(pw);
        yield pw.init();
        t.pass('should be inited');
        t.is(pw.logined(), false, 'should be not logined');
        // XXX find a better way to mock...
        const loginPromise = new Promise((res, rej) => pw.once('login', _ => res('loginFired')));
        pw.server.emit('login');
        t.is(yield loginPromise, 'loginFired', 'should fired login event');
        t.is(pw.logined(), true, 'should be logined');
        t.truthy(STUB_BRIDGE_GET_USER_NAME.called, 'bridge.getUserName should be called');
        t.truthy(STUB_GET_CONTACT.called, 'pw.getContact should be called');
        t.truthy(STUB_CONTACT_FIND_ALL.called, 'contactFind stub should be called');
        t.is(STUB_CONTACT_FIND_ALL.callCount, 5, 'should call stubContactFind 5 times');
        const logoutPromise = new Promise((res, rej) => pw.once('logout', _ => res('logoutFired')));
        pw.server.emit('logout');
        t.is(yield logoutPromise, 'logoutFired', 'should fire logout event');
        t.is(pw.logined(), false, 'should be logouted');
        yield pw.quit();
    }
    finally {
        STUB_BRIDGE_GET_USER_NAME.restore();
        STUB_BRIDGE_INIT.restore();
        STUB_CONTACT_FIND_ALL.restore();
        STUB_GET_CONTACT.restore();
        STUB_INIT_BROWSER.restore();
        STUB_QUIT.restore();
    }
}));
ava_1.test.serial('server/browser WebSocket ding', (t) => __awaiter(this, void 0, void 0, function* () {
    const puppet = new puppet_web_1.default();
    t.truthy(puppet, 'should instantiated a PuppetWeb');
    _1.config.puppetInstance(puppet);
    const EXPECTED_DING_DATA = 'dingdong';
    try {
        yield puppet.init();
        t.pass('should be inited');
        const ret = yield dingSocket(puppet.server);
        t.is(ret, EXPECTED_DING_DATA, 'should got EXPECTED_DING_DATA after resolved dingSocket()');
    }
    catch (e) {
        t.fail(e && e.message || e || 'unknown exception???');
    }
    try {
        yield puppet.quit();
    }
    catch (err) {
        t.fail(err.message);
    }
    return;
    /////////////////////////////////////////////////////////////////////////////
    function dingSocket(server) {
        const maxTime = 60000; // 60s
        const waitTime = 3000;
        let totalTime = 0;
        return new Promise((resolve, reject) => {
            _1.log.verbose('TestPuppetWeb', 'dingSocket()');
            const timeoutTimer = setTimeout(_ => {
                reject('dingSocket() no response timeout after ' + 2 * maxTime);
            }, 2 * maxTime);
            timeoutTimer.unref();
            testDing();
            return;
            function testDing() {
                _1.log.silly('TestPuppetWeb', 'dingSocket() server.socketServer: %s', server.socketServer);
                if (!server.socketClient) {
                    totalTime += waitTime;
                    if (totalTime > maxTime) {
                        return reject('testDing() timeout after ' + totalTime + 'ms');
                    }
                    _1.log.silly('TestPuppetWeb', 'waiting socketClient to connect for ' + totalTime + '/' + maxTime + ' ms...');
                    setTimeout(testDing, waitTime);
                    return;
                }
                // server.socketClient is set
                _1.log.silly('TestPuppetWeb', 'dingSocket() server.socketClient: %s', server.socketClient.readyState);
                server.once('dong', data => {
                    _1.log.verbose('TestPuppetWeb', 'socket recv event dong: ' + data);
                    clearTimeout(timeoutTimer);
                    return resolve(data);
                });
                const obj = {
                    name: 'ding',
                    data: EXPECTED_DING_DATA,
                };
                server.socketClient.send(JSON.stringify(obj));
            }
        });
    }
}));
//# sourceMappingURL=puppet-web.spec.js.map