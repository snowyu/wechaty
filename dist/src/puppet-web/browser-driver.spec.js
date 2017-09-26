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
const config_1 = require("../config");
const browser_driver_1 = require("./browser-driver");
ava_1.test('BrowserDriver smoke testing', (t) => __awaiter(this, void 0, void 0, function* () {
    let err = new Error('not run');
    let ttl = 3;
    while (err && ttl--) {
        try {
            const browserDriver = new browser_driver_1.default(config_1.config.head);
            t.truthy(browserDriver, 'BrowserDriver instnace');
            yield browserDriver.init();
            const driver = browserDriver.getWebDriver();
            t.truthy(driver, 'should get webdriver instance');
            yield driver.get('https://mp.weixin.qq.com/');
            t.pass('should open mp.weixin.qq.com');
            const retAdd = yield driver.executeScript('return 1 + 1');
            t.is(retAdd, 2, 'should return 2 for execute 1+1 in browser');
            yield browserDriver.close().catch(() => { });
            yield browserDriver.quit().catch(() => { });
            err = null;
        }
        catch (e) {
            err = e;
            config_1.log.error('TestPuppetWebBrowserDriver', 'ttl %d, exception: %s', ttl, e && e.message || e);
        }
    }
    if (err && ttl <= 0) {
        t.fail('ttl timeout: ' + (err && err.message || err));
    }
}));
//# sourceMappingURL=browser-driver.spec.js.map