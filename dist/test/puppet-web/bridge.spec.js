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
const _1 = require("../../src/puppet-web/");
const sinon_1 = require("sinon");
ava_1.test('retryPromise()', (t) => __awaiter(this, void 0, void 0, function* () {
    const EXPECTED_RESOLVE = 'Okey';
    const EXPECTED_REJECT = 'NotTheTime';
    function delayedFactory(timeout) {
        const startTime = Date.now();
        return function () {
            const nowTime = Date.now();
            if (nowTime - startTime > timeout) {
                return Promise.resolve(EXPECTED_RESOLVE);
            }
            return Promise.reject(EXPECTED_REJECT);
        };
    }
    const thenSpy = sinon_1.spy();
    const retryPromise = require('retry-promise').default;
    const delay500 = delayedFactory(500);
    yield retryPromise({ max: 1, backoff: 1 }, function () {
        return delay500();
    }).catch(e => {
        thenSpy(e);
    });
    t.true(thenSpy.withArgs(EXPECTED_REJECT).calledOnce, 'should got EXPECTED_REJECT when wait not enough');
    thenSpy.reset();
    const anotherDelay50 = delayedFactory(50);
    yield retryPromise({ max: 6, backoff: 10 }, function () {
        return anotherDelay50();
    })
        .then(r => {
        thenSpy(r);
    });
    t.true(thenSpy.withArgs(EXPECTED_RESOLVE).calledOnce, 'should got EXPECTED_RESOLVE when wait enough');
}));
ava_1.test('WechatyBro.ding()', (t) => __awaiter(this, void 0, void 0, function* () {
    const PORT = 58788;
    const browser = new _1.Browser();
    t.truthy(browser, 'should instanciated a browser');
    const mockPuppet = { browser: browser };
    const bridge = new _1.Bridge(mockPuppet, PORT);
    t.truthy(bridge, 'should instanciated a bridge with mocked puppet');
    try {
        yield browser.init();
        t.pass('should instanciated a browser');
        yield browser.open();
        t.pass('should open success');
        yield bridge.inject();
        t.pass('should injected WechatyBro');
        const retDing = yield bridge.execute('return WechatyBro.ding()');
        t.is(retDing, 'dong', 'should got dong after execute WechatyBro.ding()');
        const retCode = yield bridge.proxyWechaty('isLogin');
        t.is(typeof retCode, 'boolean', 'should got a boolean after call proxyWechaty(isLogin)');
    }
    catch (err) {
        t.fail('exception: ' + err.message);
    }
    finally {
        try {
            yield bridge.quit();
            t.pass('b.quit()');
        }
        catch (e) {
            t.fail(e);
        }
        try {
            yield browser.quit();
            t.pass('browser.quit()');
        }
        catch (e) {
            t.fail(e);
        }
    }
}));
//# sourceMappingURL=bridge.spec.js.map