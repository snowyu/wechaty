/// <reference types="node" />
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
 *  @ignore
 */
import { EventEmitter } from 'events';
import { HeadName, PuppetName, Sayable } from './config';
import { Contact } from './contact';
import { FriendRequest } from './friend-request';
import { Message, MediaMessage } from './message';
import { Puppet } from './puppet';
import { Room } from './room';
export interface PuppetSetting {
    head?: HeadName;
    puppet?: PuppetName;
    profile?: string;
}
export declare type WechatyEventName = 'error' | 'friend' | 'heartbeat' | 'login' | 'logout' | 'message' | 'room-join' | 'room-leave' | 'room-topic' | 'scan';
/**
 * Main bot class.
 *
 * [The World's Shortest ChatBot Code: 6 lines of JavaScript]{@link #wechatyinstance}
 *
 * [Wechaty Starter Project]{@link https://github.com/lijiarui/wechaty-getting-started}
 * @example
 * import { Wechaty } from 'wechaty'
 *
 */
export declare class Wechaty extends EventEmitter implements Sayable {
    private setting;
    /**
     * singleton _instance
     * @private
     */
    private static _instance;
    /**
     * the puppet
     * @private
     */
    puppet: Puppet | null;
    /**
     * the state
     * @private
     */
    private state;
    /**
     * the uuid
     * @private
     */
    uuid: string;
    /**
     * get the singleton instance of Wechaty
     *
     * @example <caption>The World's Shortest ChatBot Code: 6 lines of JavaScript</caption>
     * const { Wechaty } = require('wechaty')
     *
     * Wechaty.instance() // Singleton
     * .on('scan', (url, code) => console.log(`Scan QR Code to login: ${code}\n${url}`))
     * .on('login',       user => console.log(`User ${user} logined`))
     * .on('message',  message => console.log(`Message: ${message}`))
     * .init()
     */
    static instance(setting?: PuppetSetting): Wechaty;
    /**
     * @private
     */
    private constructor();
    /**
     * @private
     */
    toString(): string;
    /**
     * Return version of Wechaty
     *
     * @param {boolean} [forceNpm=false]  - if set to true, will only return the version in package.json.
     *                                      otherwise will return git commit hash if .git exists.
     * @returns {string}                  - the version number
     * @example
     * console.log(Wechaty.instance().version())       // return '#git[af39df]'
     * console.log(Wechaty.instance().version(true))   // return '0.7.9'
     */
    static version(forceNpm?: boolean): string;
    /**
     * @private
     */
    version(forceNpm?: any): string;
    /**
     * @private
     */
    user(): Contact;
    /**
     * @private
     */
    reset(reason?: string): Promise<void>;
    /**
     * Initialize the bot, return Promise.
     *
     * @returns {Promise<void>}
     * @example
     * await bot.init()
     * // do other stuff with bot here
     */
    init(): Promise<void>;
    on(event: 'error', listener: (this: Wechaty, error: Error) => void): this;
    on(event: 'friend', listener: (this: Wechaty, friend: Contact, request?: FriendRequest) => void): this;
    on(event: 'heartbeat', listener: (this: Wechaty, data: any) => void): this;
    on(event: 'logout', listener: (this: Wechaty, user: Contact) => void): this;
    on(event: 'login', listener: (this: Wechaty, user: Contact) => void): this;
    on(event: 'message', listener: (this: Wechaty, message: Message) => void): this;
    on(event: 'room-join', listener: (this: Wechaty, room: Room, inviteeList: Contact[], inviter: Contact) => void): this;
    on(event: 'room-leave', listener: (this: Wechaty, room: Room, leaverList: Contact[]) => void): this;
    on(event: 'room-topic', listener: (this: Wechaty, room: Room, topic: string, oldTopic: string, changer: Contact) => void): this;
    on(event: 'scan', listener: (this: Wechaty, url: string, code: number) => void): this;
    on(event: never, listener: any): this;
    /**
     * @private
     */
    initPuppet(): Promise<Puppet>;
    /**
     * Quit the bot
     *
     * @returns {Promise<void>}
     * @example
     * await bot.quit()
     */
    quit(): Promise<void>;
    /**
     * Logout the bot
     *
     * @returns {Promise<void>}
     * @example
     * await bot.logout()
     */
    logout(): Promise<void>;
    /**
     * Get current user
     *
     * @returns {Contact}
     * @example
     * const contact = bot.self()
     * console.log(`Bot is ${contact.name()}`)
     */
    self(): Contact;
    /**
     * @private
     */
    send(message: Message | MediaMessage): Promise<boolean>;
    /**
     * Send message to filehelper
     *
     * @param {string} content
     * @returns {Promise<boolean>}
     */
    say(content: string): Promise<boolean>;
    /**
     * @private
     */
    static sleep(millisecond: number): Promise<void>;
    /**
     * @private
     */
    ding(): Promise<string>;
}
export default Wechaty;
