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
const _1 = require("../src/puppet-web/");
ava_1.test('WebDriver smoke testing', (t) => __awaiter(this, void 0, void 0, function* () {
    try {
        const browser = new _1.Browser();
        t.truthy(browser, 'Browser instnace');
        let pids = yield browser.getBrowserPidList();
        t.is(pids.length, 0, 'should has no browser process before init()');
        yield browser.driver.init();
        const driver = browser.driver.getWebDriver(); // for help function `execute`
        t.truthy(driver, 'should get webdriver instance');
        yield driver.get('https://wx.qq.com/');
        t.pass('should open wx.qq.com');
        pids = yield browser.getBrowserPidList();
        t.truthy(pids.length > 0, 'should exist browser process after get()');
        yield browser.driver.close();
        yield browser.driver.quit();
        pids = yield browser.getBrowserPidList();
        t.is(pids.length, 0, 'should not exist browser process after quit()');
    }
    catch (e) {
        t.fail(e && e.message || e);
    }
}));
//# sourceMappingURL=webdriver.spec.js.map