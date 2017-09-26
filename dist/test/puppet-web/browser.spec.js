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
const fs = require("fs");
const ava_1 = require("ava");
const _1 = require("../../");
const _2 = require("../../src/puppet-web/");
const TEST_DOMAIN = 'www.chatie.io';
const TEST_URL = 'https://' + TEST_DOMAIN;
const PROFILE = _1.config.DEFAULT_PROFILE + '-' + process.pid + '-';
let profileCounter = 1;
ava_1.test('Cookie smoke testing', (t) => __awaiter(this, void 0, void 0, function* () {
    const browser = new _2.Browser();
    t.truthy(browser, 'should instanciate a browser instance');
    browser.state.target('open');
    // browser.hostname = 'wx.qq.com'
    yield browser.driver.init();
    t.pass('should init driver');
    yield browser.open(TEST_URL);
    t.pass('should opened');
    browser.state.current('open');
    const two = yield browser.execute('return 1+1');
    t.is(two, 2, 'should got 2 after execute script 1+1');
    let cookies = yield browser.driver.manage().getCookies();
    t.truthy(cookies.length, 'should got plenty of cookies');
    yield browser.driver.manage().deleteAllCookies();
    cookies = yield browser.driver.manage().getCookies();
    t.is(cookies.length, 0, 'should no cookie anymore after deleteAllCookies()');
    const EXPECTED_COOKIES = [{
            name: 'wechaty0',
            value: '8788-0',
            path: '/',
            domain: '.chatie.io',
            secure: false,
            expiry: 2133683026,
        },
        {
            name: 'wechaty1',
            value: '8788-1',
            path: '/',
            domain: '.chatie.io',
            secure: false,
            expiry: 2133683026,
        }];
    yield browser.addCookie(EXPECTED_COOKIES);
    const tt = yield browser.readCookie();
    yield Promise.all(tt);
    cookies = yield browser.driver.manage().getCookies();
    const cookies0 = cookies.filter(c => { return RegExp(EXPECTED_COOKIES[0].name).test(c.name); });
    t.is(cookies0[0].name, EXPECTED_COOKIES[0].name, 'getCookies() should filter out the cookie named wechaty0');
    const cookies1 = cookies.filter(c => { return RegExp(EXPECTED_COOKIES[1].name).test(c.name); });
    t.truthy(cookies1, 'should get cookies1');
    t.is(cookies1[0].name, EXPECTED_COOKIES[1].name, 'getCookies() should filter out the cookie named wechaty1');
    yield browser.open(TEST_URL);
    t.pass('re-opened url');
    const cookieAfterOpen = yield browser.driver.manage().getCookie(EXPECTED_COOKIES[0].name);
    t.is(cookieAfterOpen.name, EXPECTED_COOKIES[0].name, 'getCookie() should get expected cookie named after re-open url');
    const dead = browser.dead();
    t.is(dead, false, 'should be a not dead browser');
    const live = yield browser.readyLive();
    t.is(live, true, 'should be a live browser');
    yield browser.driver.quit();
}));
ava_1.test('Cookie save/load', (t) => __awaiter(this, void 0, void 0, function* () {
    const profileName = PROFILE + (profileCounter++);
    let browser = new _2.Browser({
        head: _1.config.head,
        sessionFile: profileName,
    });
    /**
     * use exception to call b.quit() to clean up
     */
    try {
        t.truthy(browser, 'should get a new Browser');
        browser.state.target('open');
        // browser.hostname = 'wx.qq.com'
        yield browser.driver.init();
        t.pass('should init driver');
        yield browser.open(TEST_URL);
        t.pass('opened');
        const EXPECTED_COOKIE = {
            name: 'wechaty_save_to_session',
            value: '### This cookie should be saved to session file, and load back at next PuppetWeb init  ###',
            path: '/',
            domain: '.chatie.io',
            secure: false,
            expiry: 2133683026,
        };
        const EXPECTED_NAME_REGEX = new RegExp('^' + EXPECTED_COOKIE.name + '$');
        yield browser.driver.manage().deleteAllCookies();
        const cookies = yield browser.driver.manage().getCookies();
        t.is(cookies.length, 0, 'should no cookie after deleteAllCookies()');
        yield browser.addCookie(EXPECTED_COOKIE);
        const cookieFromBrowser = yield browser.driver.manage().getCookie(EXPECTED_COOKIE.name);
        t.truthy(cookieFromBrowser, 'should get cookie from browser');
        t.is(cookieFromBrowser.name, EXPECTED_COOKIE.name, 'cookie from getCookie() should be same as we just set');
        let cookiesFromCheck = yield browser.readCookie();
        t.truthy(cookiesFromCheck.length, 'should get cookies from checkSession() after addCookies()');
        let cookieFromCheck = cookiesFromCheck.filter(c => EXPECTED_NAME_REGEX.test(c['name']));
        t.is(cookieFromCheck[0]['name'], EXPECTED_COOKIE.name, 'cookie from checkSession() return should be same as we just set by addCookies()');
        yield browser.saveCookie();
        const cookiesFromSave = yield browser.readCookie();
        t.truthy(cookiesFromSave.length, 'should get cookies from saveSession()');
        const cookieFromSave = cookiesFromSave.filter(c => EXPECTED_NAME_REGEX.test(c['name']));
        t.is(cookieFromSave.length, 1, 'should has the cookie we just set');
        t.is(cookieFromSave[0]['name'], EXPECTED_COOKIE.name, 'cookie from saveSession() return should be same as we just set');
        yield browser.driver.manage().deleteAllCookies();
        cookiesFromCheck = yield browser.readCookie();
        t.is(cookiesFromCheck.length, 0, 'should no cookie from checkSession() after deleteAllCookies()');
        yield browser.loadCookie(); // .catch(() => { /* fail safe */ })
        const cookiesFromLoad = yield browser.readCookie();
        // XXX: circle ci sometimes fail at next line
        t.truthy(cookiesFromLoad.length, 'should get cookies after loadSession()');
        const cookieFromLoad = cookiesFromLoad.filter(c => EXPECTED_NAME_REGEX.test(c.name));
        t.is(cookieFromLoad[0].name, EXPECTED_COOKIE.name, 'cookie from loadSession() should has expected cookie');
        cookiesFromCheck = yield browser.readCookie();
        t.truthy(cookiesFromCheck.length, 'should get cookies from checkSession() after loadSession()');
        cookieFromCheck = cookiesFromCheck.filter(c => EXPECTED_NAME_REGEX.test(c['name']));
        t.truthy(cookieFromCheck.length, 'should has cookie after filtered after loadSession()');
        t.is(cookieFromCheck[0]['name'], EXPECTED_COOKIE.name, 'cookie from checkSession() return should has expected cookie after loadSession');
        yield browser.driver.quit();
        t.pass('quited');
        /**
         * start new browser process
         * with the same sessionFile: profileName
         */
        browser = new _2.Browser({
            head: _1.config.head,
            sessionFile: profileName,
        });
        t.pass('should started a new Browser');
        browser.state.target('open');
        // browser.hostname = 'wx.qq.com'
        yield browser.driver.init();
        t.pass('should inited the new Browser');
        yield browser.open(TEST_URL);
        t.pass('should opened');
        yield browser.loadCookie();
        t.pass('should loadSession for new Browser(process)');
        const cookieAfterQuit = yield browser.driver.manage().getCookie(EXPECTED_COOKIE.name);
        t.truthy(cookieAfterQuit, 'should get cookie from getCookie()');
        t.is(cookieAfterQuit.name, EXPECTED_COOKIE.name, 'cookie from getCookie() after browser quit, should load the right cookie back');
    }
    catch (e) {
        t.fail('exception: ' + e.message);
    }
    finally {
        if (browser && browser.driver) {
            yield browser.driver.quit();
        }
        fs.unlink(profileName, err => {
            if (err) {
                _1.log.warn('Browser', 'unlink session file %s fail: %s', PROFILE, err);
            }
        });
    }
}));
ava_1.test('Hostname smoke testing', (t) => __awaiter(this, void 0, void 0, function* () {
    const browser = new _2.Browser();
    t.truthy(browser, 'should instanciate a browser instance');
    browser.state.target('open');
    yield browser.driver.init();
    t.pass('should init driver');
    yield browser.open(TEST_URL);
    t.pass('should opened');
    browser.state.current('open');
    const hostname = yield browser.hostname();
    t.is(hostname, TEST_DOMAIN, 'should get hostname as "chatie.io"');
    yield browser.quit();
}));
//# sourceMappingURL=browser.spec.js.map