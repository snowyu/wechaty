"use strict";
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
const config_1 = require("./config");
ava_1.test('important variables', t => {
    t.true('head' in config_1.config, 'should exist `head` in Config');
    t.true('puppet' in config_1.config, 'should exist `puppet` in Config');
    t.true('apihost' in config_1.config, 'should exist `apihost` in Config');
    t.true('port' in config_1.config, 'should exist `port` in Config');
    t.true('profile' in config_1.config, 'should exist `profile` in Config');
    t.true('token' in config_1.config, 'should exist `token` in Config');
    t.truthy(config_1.config.DEFAULT_PUPPET, 'should export DEFAULT_PUPPET');
    t.truthy(config_1.config.DEFAULT_PORT, 'should export DEFAULT_PORT');
    t.truthy(config_1.config.DEFAULT_PROFILE, 'should export DEFAULT_PROFILE');
    t.truthy(config_1.config.DEFAULT_HEAD, 'should export DEFAULT_HEAD');
    t.truthy(config_1.config.DEFAULT_PROTOCOL, 'should export DEFAULT_PROTOCOL');
    t.truthy(config_1.config.DEFAULT_APIHOST, 'should export DEFAULT_APIHOST');
    t.truthy(config_1.config.CMD_CHROMIUM, 'should export CMD_CHROMIUM');
});
ava_1.test('validApiHost()', t => {
    const OK_APIHOSTS = [
        'api.wechaty.io',
        'wechaty.io:8080',
    ];
    const ERR_APIHOSTS = [
        'https://api.wechaty.io',
        'wechaty.io/',
    ];
    OK_APIHOSTS.forEach(apihost => {
        t.notThrows(() => {
            config_1.config.validApiHost(apihost);
        });
    }, 'should not row for right apihost');
    ERR_APIHOSTS.forEach(apihost => {
        t.throws(() => {
            config_1.config.validApiHost(apihost);
        });
    }, 'should throw for error apihost');
});
ava_1.test('puppetInstance()', t => {
    t.throws(() => {
        config_1.config.puppetInstance();
    }, Error, 'should throw when not initialized');
    const EXPECTED = { userId: 'test' };
    const mockPuppet = EXPECTED;
    config_1.config.puppetInstance(mockPuppet);
    const instance = config_1.config.puppetInstance();
    t.deepEqual(instance, EXPECTED, 'should equal with initialized data');
    config_1.config.puppetInstance(null);
    t.throws(() => {
        config_1.config.puppetInstance();
    }, Error, 'should throw after set to null');
});
ava_1.test('dockerMode', t => {
    t.true('dockerMode' in config_1.config, 'should identify docker env by `dockerMode`');
    if ('C9_PORT' in process.env) {
        t.is(config_1.config.dockerMode, false, 'should not in docker mode in Cloud9 IDE');
    }
    else if (require('is-ci')) {
        t.is(config_1.config.dockerMode, false, 'should not in docker mode in Continuous Integeration System');
    }
    else {
        // a custom running envioronment, maybe docker, maybe not
    }
});
//# sourceMappingURL=config.spec.js.map