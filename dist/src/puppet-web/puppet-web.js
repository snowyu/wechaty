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
const config_1 = require("../config");
const contact_1 = require("../contact");
const message_1 = require("../message");
const puppet_1 = require("../puppet");
const room_1 = require("../room");
const util_lib_1 = require("../util-lib");
const bridge_1 = require("./bridge");
const browser_1 = require("./browser");
const event_1 = require("./event");
const server_1 = require("./server");
const watchdog_1 = require("./watchdog");
const request = require("request");
const bl = require("bl");
const DEFAULT_PUPPET_PORT = 18788; // W(87) X(88), ascii char code ;-]
class PuppetWeb extends puppet_1.Puppet {
    constructor(setting = {}) {
        super();
        this.setting = setting;
        this.fileId = 0;
        if (!setting.head) {
            setting.head = config_1.config.head;
        }
        this.on('watchdog', watchdog_1.default.onFeed.bind(this));
    }
    toString() { return `Class PuppetWeb({browser:${this.browser},port:${this.port}})`; }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('PuppetWeb', `init() with head:${this.setting.head}, profile:${this.setting.profile}`);
            this.state.target('live');
            this.state.current('live', false);
            try {
                this.port = yield util_lib_1.default.getPort(DEFAULT_PUPPET_PORT);
                config_1.log.verbose('PuppetWeb', 'init() getPort %d', this.port);
                yield this.initServer();
                config_1.log.verbose('PuppetWeb', 'initServer() done');
                this.browser = yield this.initBrowser();
                config_1.log.verbose('PuppetWeb', 'initBrowser() done');
                try {
                    this.bridge = yield this.initBridge();
                }
                catch (e) {
                    config_1.log.verbose('PuppetWeb', 'init() this.initBridge() exception: %s', e.message);
                    const blockedMessage = (yield this.bridge.blockedMessageBody())
                        || (yield this.bridge.blockedMessageAlert());
                    if (blockedMessage) {
                        const error = new Error(blockedMessage);
                        this.emit('error', error);
                    }
                    throw e;
                }
                config_1.log.verbose('PuppetWeb', 'initBridge() done');
                const clicked = yield this.browser.clickSwitchAccount();
                if (clicked) {
                    config_1.log.verbose('PuppetWeb', 'init() bridge.clickSwitchAccount() clicked');
                }
                /**
                 *  state must set to `live`
                 *  before feed Watchdog
                 */
                this.state.current('live');
                const food = {
                    data: 'inited',
                    timeout: 2 * 60 * 1000,
                };
                this.emit('watchdog', food);
                config_1.log.verbose('PuppetWeb', 'init() done');
                return;
            }
            catch (e) {
                config_1.log.error('PuppetWeb', 'init() exception: %s', e.stack);
                this.emit('error', e);
                yield this.quit();
                this.state.target('dead');
                config_1.Raven.captureException(e);
                throw e;
            }
        });
    }
    quit() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('PuppetWeb', 'quit() state target(%s) current(%s) stable(%s)', this.state.target(), this.state.current(), this.state.stable());
            if (this.state.current() === 'dead') {
                if (this.state.inprocess()) {
                    const e = new Error('quit() is called on a `dead` `inprocess()` browser');
                    config_1.log.warn('PuppetWeb', e.message);
                    throw e;
                }
                else {
                    config_1.log.warn('PuppetWeb', 'quit() is called on a `dead` browser. return directly.');
                    return;
                }
            }
            /**
             * must feed POISON to Watchdog
             * before state set to `dead` & `inprocess`
             */
            config_1.log.verbose('PuppetWeb', 'quit() kill watchdog before do quit');
            const food = {
                data: 'PuppetWeb.quit()',
                type: 'POISON',
            };
            this.emit('watchdog', food);
            this.state.target('dead');
            this.state.current('dead', false);
            try {
                yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    const timer = setTimeout(() => {
                        const e = new Error('quit() Promise() timeout');
                        config_1.log.warn('PuppetWeb', e.message);
                        reject(e);
                    }, 120 * 1000);
                    if (this.bridge) {
                        yield this.bridge.quit()
                            .catch(e => {
                            config_1.log.warn('PuppetWeb', 'quit() bridge.quit() exception: %s', e.message);
                            config_1.Raven.captureException(e);
                        });
                        config_1.log.verbose('PuppetWeb', 'quit() bridge.quit() done');
                    }
                    else {
                        config_1.log.warn('PuppetWeb', 'quit() no this.bridge');
                    }
                    if (this.server) {
                        yield this.server.quit()
                            .catch(e => {
                            config_1.log.warn('PuppetWeb', 'quit() server.quit() exception: %s', e.message);
                            config_1.Raven.captureException(e);
                        });
                        config_1.log.verbose('PuppetWeb', 'quit() server.quit() done');
                    }
                    else {
                        config_1.log.warn('PuppetWeb', 'quit() no this.server');
                    }
                    if (this.browser) {
                        yield this.browser.quit()
                            .catch(e => {
                            config_1.log.warn('PuppetWeb', 'quit() browser.quit() exception: %s', e.message);
                            config_1.Raven.captureException(e);
                        });
                        config_1.log.verbose('PuppetWeb', 'quit() browser.quit() done');
                    }
                    else {
                        config_1.log.warn('PuppetWeb', 'quit() no this.browser');
                    }
                    clearTimeout(timer);
                    resolve();
                    return;
                }));
                return;
            }
            catch (e) {
                config_1.log.error('PuppetWeb', 'quit() exception: %s', e.message);
                config_1.Raven.captureException(e);
                throw e;
            }
            finally {
                this.state.current('dead');
            }
        });
    }
    initBrowser() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('PuppetWeb', 'initBrowser()');
            const browser = new browser_1.default({
                head: this.setting.head,
                sessionFile: this.setting.profile,
            });
            browser.on('dead', event_1.default.onBrowserDead.bind(this));
            if (this.state.target() === 'dead') {
                const e = new Error('found state.target()) != live, no init anymore');
                config_1.log.warn('PuppetWeb', 'initBrowser() %s', e.message);
                throw e;
            }
            try {
                yield browser.init();
            }
            catch (e) {
                config_1.log.error('PuppetWeb', 'initBrowser() exception: %s', e.message);
                config_1.Raven.captureException(e);
                throw e;
            }
            return browser;
        });
    }
    initBridge() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('PuppetWeb', 'initBridge()');
            const bridge = new bridge_1.Bridge(this, // use puppet instead of browser, is because browser might change(die) duaring run time,
            this.port);
            if (this.state.target() === 'dead') {
                const e = new Error('initBridge() found targetState != live, no init anymore');
                config_1.log.warn('PuppetWeb', e.message);
                throw e;
            }
            try {
                yield bridge.init();
            }
            catch (e) {
                config_1.Raven.captureException(e);
                if (!this.browser) {
                    config_1.log.warn('PuppetWeb', 'initBridge() without browser?');
                }
                else if (this.browser.dead()) {
                    // XXX should make here simple: why this.browser.dead() then exception will not throw?
                    config_1.log.warn('PuppetWeb', 'initBridge() found browser dead, wait it to restore');
                }
                else {
                    config_1.log.error('PuppetWeb', 'initBridge() exception: %s', e.message);
                    throw e;
                }
            }
            return bridge;
        });
    }
    initServer() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('PuppetWeb', 'initServer()');
            this.server = new server_1.default(this.port);
            /**
             * @depreciated 20160825 zixia
             *
             * when `unload` there should always be a `disconnect` event?
             */
            // server.on('unload'  , Event.onServerUnload.bind(this))
            this.server.on('connection', event_1.default.onServerConnection.bind(this));
            this.server.on('ding', event_1.default.onServerDing.bind(this));
            this.server.on('disconnect', event_1.default.onServerDisconnect.bind(this));
            this.server.on('log', event_1.default.onServerLog.bind(this));
            this.server.on('login', event_1.default.onServerLogin.bind(this));
            this.server.on('logout', event_1.default.onServerLogout.bind(this));
            this.server.on('message', event_1.default.onServerMessage.bind(this));
            this.server.on('scan', event_1.default.onServerScan.bind(this));
            if (this.state.target() === 'dead') {
                const e = new Error('initServer() found state.target() != live, no init anymore');
                config_1.log.warn('PuppetWeb', e.message);
                throw e;
            }
            try {
                yield this.server.init();
            }
            catch (e) {
                config_1.log.error('PuppetWeb', 'initServer() exception: %s', e.message);
                config_1.Raven.captureException(e);
                throw e;
            }
            return;
        });
    }
    reset(reason) {
        config_1.log.verbose('PuppetWeb', 'reset(%s)', reason);
        if (this.browser) {
            this.browser.dead('restart required by reset()');
        }
        else {
            config_1.log.warn('PuppetWeb', 'reset() without browser');
        }
    }
    logined() { return !!(this.user); }
    /**
     * get self contact
     */
    self() {
        config_1.log.verbose('PuppetWeb', 'self()');
        if (this.user) {
            return this.user;
        }
        throw new Error('PuppetWeb.self() no this.user');
    }
    getBaseRequest() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const json = yield this.bridge.getBaseRequest();
                const obj = JSON.parse(json);
                return obj.BaseRequest;
            }
            catch (e) {
                config_1.log.error('PuppetWeb', 'send() exception: %s', e.message);
                config_1.Raven.captureException(e);
                throw e;
            }
        });
    }
    uploadMedia(mediaMessage, toUserName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mediaMessage)
                throw new Error('require mediaMessage');
            const filename = mediaMessage.filename();
            const ext = mediaMessage.ext();
            const contentType = util_lib_1.default.mime(ext);
            let mediatype;
            switch (ext) {
                case 'bmp':
                case 'jpeg':
                case 'jpg':
                case 'png':
                case 'gif':
                    mediatype = 'pic';
                    break;
                case 'mp4':
                    mediatype = 'video';
                    break;
                default:
                    mediatype = 'doc';
            }
            const readStream = yield mediaMessage.readyStream();
            const buffer = yield new Promise((resolve, reject) => {
                readStream.pipe(bl((err, data) => {
                    if (err)
                        reject(err);
                    else
                        resolve(data);
                }));
            });
            // Sending video files is not allowed to exceed 20MB
            // https://github.com/Chatie/webwx-app-tracker/blob/7c59d35c6ea0cff38426a4c5c912a086c4c512b2/formatted/webwxApp.js#L1115
            const videoMaxSize = 20 * 1024 * 1024;
            if (mediatype === 'video' && buffer.length > videoMaxSize)
                throw new Error(`Sending video files is not allowed to exceed ${videoMaxSize / 1024 / 1024}MB`);
            const md5 = util_lib_1.default.md5(buffer);
            const baseRequest = yield this.getBaseRequest();
            const passTicket = yield this.bridge.getPassticket();
            const uploadMediaUrl = yield this.bridge.getUploadMediaUrl();
            const cookie = yield this.browser.readCookie();
            const first = cookie.find(c => c.name === 'webwx_data_ticket');
            const webwxDataTicket = first && first.value;
            const size = buffer.length;
            const id = 'WU_FILE_' + this.fileId;
            this.fileId++;
            const hostname = yield this.browser.hostname();
            const uploadMediaRequest = {
                BaseRequest: baseRequest,
                FileMd5: md5,
                FromUserName: this.self().id,
                ToUserName: toUserName,
                UploadType: 2,
                ClientMediaId: +new Date,
                MediaType: 4 /* ATTACHMENT */,
                StartPos: 0,
                DataLen: size,
                TotalLen: size,
            };
            const mediaData = {
                ToUserName: toUserName,
                MediaId: '',
                FileName: filename,
                FileSize: size,
                FileMd5: md5,
                MMFileId: id,
                MMFileExt: ext,
            };
            config_1.log.verbose('PuppetWeb', 'uploadMedia() webwx_data_ticket: %s', webwxDataTicket);
            config_1.log.verbose('PuppetWeb', 'uploadMedia() pass_ticket: %s', passTicket);
            const formData = {
                id,
                name: filename,
                type: contentType,
                lastModifiedDate: Date().toString(),
                size,
                mediatype,
                uploadmediarequest: JSON.stringify(uploadMediaRequest),
                webwx_data_ticket: webwxDataTicket,
                pass_ticket: passTicket,
                filename: {
                    value: buffer,
                    options: {
                        filename,
                        contentType,
                        size,
                    },
                },
            };
            const mediaId = yield new Promise((resolve, reject) => {
                request.post({
                    url: uploadMediaUrl + '?f=json',
                    headers: {
                        Referer: `https://${hostname}`,
                        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
                    },
                    formData,
                }, function (err, res, body) {
                    if (err) {
                        return reject(err);
                    }
                    try {
                        const obj = JSON.parse(body);
                        return resolve(obj.MediaId);
                    }
                    catch (e) {
                        return reject(e);
                    }
                });
            });
            if (!mediaId) {
                throw new Error('upload fail');
            }
            return Object.assign(mediaData, { MediaId: mediaId });
        });
    }
    sendMedia(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const to = message.to();
            const room = message.room();
            let destinationId;
            if (room) {
                destinationId = room.id;
            }
            else {
                if (!to) {
                    throw new Error('PuppetWeb.send(): message with neither room nor to?');
                }
                destinationId = to.id;
            }
            const mediaData = yield this.uploadMedia(message, destinationId);
            mediaData.MsgType = util_lib_1.default.msgType(message.ext());
            config_1.log.silly('PuppetWeb', 'send() destination: %s, mediaId: %s)', destinationId, mediaData.MediaId);
            let ret = false;
            try {
                ret = yield this.bridge.sendMedia(mediaData);
            }
            catch (e) {
                config_1.log.error('PuppetWeb', 'send() exception: %s', e.message);
                config_1.Raven.captureException(e);
                return false;
            }
            return ret;
        });
    }
    forward(baseData, patchData) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.silly('PuppetWeb', 'forward() destination: %s, content: %s)', patchData.ToUserName, patchData.MMActualContent);
            let ret = false;
            try {
                // log.info('PuppetWeb', `forward() baseData: ${JSON.stringify(baseData)}\n`)
                // log.info('PuppetWeb', `forward() patchData: ${JSON.stringify(patchData)}\n`)
                ret = yield this.bridge.forward(baseData, patchData);
            }
            catch (e) {
                config_1.log.error('PuppetWeb', 'forward() exception: %s', e.message);
                config_1.Raven.captureException(e);
                throw e;
            }
            return ret;
        });
    }
    send(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const to = message.to();
            const room = message.room();
            let destinationId;
            if (room) {
                destinationId = room.id;
            }
            else {
                if (!to) {
                    throw new Error('PuppetWeb.send(): message with neither room nor to?');
                }
                destinationId = to.id;
            }
            let ret = false;
            if (message instanceof message_1.MediaMessage) {
                ret = yield this.sendMedia(message);
            }
            else {
                const content = message.content();
                config_1.log.silly('PuppetWeb', 'send() destination: %s, content: %s)', destinationId, content);
                try {
                    ret = yield this.bridge.send(destinationId, content);
                }
                catch (e) {
                    config_1.log.error('PuppetWeb', 'send() exception: %s', e.message);
                    config_1.Raven.captureException(e);
                    throw e;
                }
            }
            return ret;
        });
    }
    /**
     * Bot say...
     * send to `filehelper` for notice / log
     */
    say(content) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.logined()) {
                throw new Error('can not say before login');
            }
            if (!content) {
                config_1.log.warn('PuppetWeb', 'say(%s) can not say nothing', content);
                return false;
            }
            const m = new message_1.Message();
            m.to('filehelper');
            m.content(content);
            return yield this.send(m);
        });
    }
    /**
     * logout from browser, then server will emit `logout` event
     */
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.bridge.logout();
            }
            catch (e) {
                config_1.log.error('PuppetWeb', 'logout() exception: %s', e.message);
                config_1.Raven.captureException(e);
                throw e;
            }
        });
    }
    getContact(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.bridge.getContact(id);
            }
            catch (e) {
                config_1.log.error('PuppetWeb', 'getContact(%d) exception: %s', id, e.message);
                config_1.Raven.captureException(e);
                throw e;
            }
        });
    }
    ding(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.bridge.ding(data);
            }
            catch (e) {
                config_1.log.warn('PuppetWeb', 'ding(%s) rejected: %s', data, e.message);
                config_1.Raven.captureException(e);
                throw e;
            }
        });
    }
    contactAlias(contact, remark) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ret = yield this.bridge.contactRemark(contact.id, remark);
                if (!ret) {
                    config_1.log.warn('PuppetWeb', 'contactRemark(%s, %s) bridge.contactRemark() return false', contact.id, remark);
                }
                return ret;
            }
            catch (e) {
                config_1.log.warn('PuppetWeb', 'contactRemark(%s, %s) rejected: %s', contact.id, remark, e.message);
                config_1.Raven.captureException(e);
                throw e;
            }
        });
    }
    contactFind(filterFunc) {
        if (!this.bridge) {
            return Promise.reject(new Error('contactFind fail: no bridge(yet)!'));
        }
        return this.bridge.contactFind(filterFunc)
            .then(idList => idList.map(id => contact_1.default.load(id)))
            .catch(e => {
            config_1.log.warn('PuppetWeb', 'contactFind(%s) rejected: %s', filterFunc, e.message);
            config_1.Raven.captureException(e);
            throw e;
        });
    }
    roomFind(filterFunc) {
        if (!this.bridge) {
            return Promise.reject(new Error('findRoom fail: no bridge(yet)!'));
        }
        return this.bridge.roomFind(filterFunc)
            .then(idList => idList.map(id => room_1.default.load(id)))
            .catch(e => {
            config_1.log.warn('PuppetWeb', 'roomFind(%s) rejected: %s', filterFunc, e.message);
            config_1.Raven.captureException(e);
            throw e;
        });
    }
    roomDel(room, contact) {
        if (!this.bridge) {
            return Promise.reject(new Error('roomDelMember fail: no bridge(yet)!'));
        }
        const roomId = room.id;
        const contactId = contact.id;
        return this.bridge.roomDelMember(roomId, contactId)
            .catch(e => {
            config_1.log.warn('PuppetWeb', 'roomDelMember(%s, %d) rejected: %s', roomId, contactId, e.message);
            config_1.Raven.captureException(e);
            throw e;
        });
    }
    roomAdd(room, contact) {
        if (!this.bridge) {
            return Promise.reject(new Error('fail: no bridge(yet)!'));
        }
        const roomId = room.id;
        const contactId = contact.id;
        return this.bridge.roomAddMember(roomId, contactId)
            .catch(e => {
            config_1.log.warn('PuppetWeb', 'roomAddMember(%s) rejected: %s', contact, e.message);
            config_1.Raven.captureException(e);
            throw e;
        });
    }
    roomTopic(room, topic) {
        if (!this.bridge) {
            return Promise.reject(new Error('fail: no bridge(yet)!'));
        }
        if (!room || typeof topic === 'undefined') {
            return Promise.reject(new Error('room or topic not found'));
        }
        const roomId = room.id;
        return this.bridge.roomModTopic(roomId, topic)
            .catch(e => {
            config_1.log.warn('PuppetWeb', 'roomTopic(%s) rejected: %s', topic, e.message);
            config_1.Raven.captureException(e);
            throw e;
        });
    }
    roomCreate(contactList, topic) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.bridge) {
                return Promise.reject(new Error('fail: no bridge(yet)!'));
            }
            if (!contactList || !contactList.map) {
                throw new Error('contactList not found');
            }
            const contactIdList = contactList.map(c => c.id);
            try {
                const roomId = yield this.bridge.roomCreate(contactIdList, topic);
                if (!roomId) {
                    throw new Error('PuppetWeb.roomCreate() roomId "' + roomId + '" not found');
                }
                return room_1.default.load(roomId);
            }
            catch (e) {
                config_1.log.warn('PuppetWeb', 'roomCreate(%s, %s) rejected: %s', contactIdList.join(','), topic, e.message);
                config_1.Raven.captureException(e);
                throw e;
            }
        });
    }
    /**
     * FriendRequest
     */
    friendRequestSend(contact, hello) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.bridge) {
                throw new Error('fail: no bridge(yet)!');
            }
            if (!contact) {
                throw new Error('contact not found');
            }
            try {
                return yield this.bridge.verifyUserRequest(contact.id, hello);
            }
            catch (e) {
                config_1.log.warn('PuppetWeb', 'bridge.verifyUserRequest(%s, %s) rejected: %s', contact.id, hello, e.message);
                config_1.Raven.captureException(e);
                throw e;
            }
        });
    }
    friendRequestAccept(contact, ticket) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.bridge) {
                return Promise.reject(new Error('fail: no bridge(yet)!'));
            }
            if (!contact || !ticket) {
                throw new Error('contact or ticket not found');
            }
            try {
                return yield this.bridge.verifyUserOk(contact.id, ticket);
            }
            catch (e) {
                config_1.log.warn('PuppetWeb', 'bridge.verifyUserOk(%s, %s) rejected: %s', contact.id, ticket, e.message);
                config_1.Raven.captureException(e);
                throw e;
            }
        });
    }
    /**
     * @private
     * For issue #668
     */
    readyStable() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('PuppetWeb', 'readyStable()');
            let counter = -1;
            function stable(resolve) {
                return __awaiter(this, void 0, void 0, function* () {
                    config_1.log.silly('PuppetWeb', 'readyStable() stable() counter=%d', counter);
                    const contactList = yield contact_1.default.findAll();
                    if (counter === contactList.length) {
                        config_1.log.verbose('PuppetWeb', 'readyStable() stable() READY counter=%d', counter);
                        return resolve();
                    }
                    counter = contactList.length;
                    setTimeout(() => stable(resolve), 1000)
                        .unref();
                });
            }
            return new Promise((resolve, reject) => {
                const timer = setTimeout(() => {
                    config_1.log.warn('PuppetWeb', 'readyStable() stable() reject at counter=%d', counter);
                    return reject(new Error('timeout after 60 seconds'));
                }, 60 * 1000);
                timer.unref();
                const myResolve = () => {
                    clearTimeout(timer);
                    resolve();
                };
                setTimeout(() => stable(myResolve), 1000);
            });
        });
    }
}
exports.PuppetWeb = PuppetWeb;
exports.default = PuppetWeb;
//# sourceMappingURL=puppet-web.js.map