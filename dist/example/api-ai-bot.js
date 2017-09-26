"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Wechaty bot use a ApiAi.com brain
 *
 * Apply Your Own ApiAi Developer API_KEY at:
 * http://www.api.ai
 *
 * Enjoy!
 */
/* tslint:disable:variable-name */
const QrcodeTerminal = require('qrcode-terminal');
const brolog_1 = require("brolog");
/* tslint:disable:no-var-requires */
// const co  = require('co')
/* tslint:disable:variable-name */
const ApiAi = require('apiai');
const events_1 = require("events");
/**
 * Change `import { ... } from '../'`
 * to     `import { ... } from 'wechaty'`
 * when you are runing with Docker or NPM instead of Git Source.
 */
const _1 = require("../");
// log.level = 'verbose'
// log.level = 'silly'
/**
 *
 * `7217d7bce18c4bcfbe04ba7bdfaf9c08` for Wechaty demo
 *
 */
const APIAI_API_KEY = '7217d7bce18c4bcfbe04ba7bdfaf9c08';
const brainApiAi = ApiAi(APIAI_API_KEY);
const bot = _1.Wechaty.instance({ profile: _1.config.DEFAULT_PROFILE });
console.log(`
Welcome to api.AI Wechaty Bot.
Api.AI Doc: https://docs.api.ai/v16/docs/get-started

Notice: This bot will only active in the room which name contains 'wechaty'.
/* if (m.room() && /Wechaty/i.test(m.room().name())) { */

Loading... please wait for QrCode Image Url and then scan to login.
`);
bot
    .on('scan', (url, code) => {
    if (!/201|200/.test(String(code))) {
        const loginUrl = url.replace(/\/qrcode\//, '/l/');
        QrcodeTerminal.generate(loginUrl);
    }
    console.log(`${url}\n[${code}] Scan QR Code in above url to login: `);
})
    .on('login', user => brolog_1.Brolog.info('Bot', `bot login: ${user}`))
    .on('logout', e => brolog_1.Brolog.info('Bot', 'bot logout.'))
    .on('message', m => {
    if (m.self()) {
        return;
    }
    // co(function* () {
    //   const msg = yield m.load()
    const room = m.room();
    if (room && /Wechaty/i.test(room.topic())) {
        brolog_1.Brolog.info('Bot', 'talk: %s', m);
        talk(m);
    }
    else {
        brolog_1.Brolog.info('Bot', 'recv: %s', m);
    }
    // })
    // .catch(e => log.error('Bot', 'on message rejected: %s' , e))
});
bot.init()
    .catch(e => {
    brolog_1.Brolog.error('Bot', 'init() fail:' + e);
    bot.quit();
    process.exit(-1);
});
class Talker extends events_1.EventEmitter {
    constructor(thinker) {
        brolog_1.Brolog.verbose('Talker()');
        super();
        this.thinker = thinker;
        this.obj = {
            text: [],
            time: [],
        };
        this.timer = null;
    }
    save(text) {
        brolog_1.Brolog.verbose('Talker', 'save(%s)', text);
        this.obj.text.push(text);
        this.obj.time.push(Date.now());
    }
    load() {
        const text = this.obj.text.join(', ');
        brolog_1.Brolog.verbose('Talker', 'load(%s)', text);
        this.obj.text = [];
        this.obj.time = [];
        return text;
    }
    updateTimer(delayTime) {
        delayTime = delayTime || this.delayTime();
        brolog_1.Brolog.verbose('Talker', 'updateTimer(%s)', delayTime);
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(this.say.bind(this), delayTime);
    }
    hear(text) {
        brolog_1.Brolog.verbose('Talker', `hear(${text})`);
        this.save(text);
        this.updateTimer();
    }
    say() {
        brolog_1.Brolog.verbose('Talker', 'say()');
        const text = this.load();
        this.thinker(text)
            .then(reply => this.emit('say', reply));
        this.timer = null;
    }
    delayTime() {
        const minDelayTime = 5000;
        const maxDelayTime = 15000;
        const delayTime = Math.floor(Math.random() * (maxDelayTime - minDelayTime)) + minDelayTime;
        return delayTime;
    }
}
/* tslint:disable:variable-name */
const Talkers = [];
function talk(m) {
    const fromId = m.from().id;
    const roomId = m.room().id;
    const content = m.content();
    const talkerName = fromId + roomId;
    if (!Talkers[talkerName]) {
        Talkers[talkerName] = new Talker(function (text) {
            return new Promise((resolve, reject) => {
                brainApiAi.textRequest(text)
                    .on('response', function (response) {
                    console.log(response);
                    /*
          { id: 'a09381bb-8195-4139-b49c-a2d03ad5e014',
            timestamp: '2016-05-27T17:22:46.597Z',
            result:
             { source: 'domains',
               resolvedQuery: 'hi',
               action: 'smalltalk.greetings',
               parameters: { simplified: 'hello' },w
               metadata: {},
               fulfillment: { speech: 'Hi there.' },
               score: 0 },
            status: { code: 200, errorType: 'success' } }
                    */
                    const reply = response.result.fulfillment.speech;
                    if (!reply) {
                        brolog_1.Brolog.info('ApiAi', `Talker do not want to talk for "${text}"`);
                        return reject();
                    }
                    brolog_1.Brolog.info('ApiAi', 'Talker reply:"%s" for "%s" ', reply, text);
                    return resolve(reply);
                })
                    .on('error', function (error) {
                    brolog_1.Brolog.error('ApiAi', error);
                    reject(error);
                })
                    .end();
            });
        });
        Talkers[talkerName].on('say', reply => m.say(reply));
    }
    Talkers[talkerName].hear(content);
}
//# sourceMappingURL=api-ai-bot.js.map