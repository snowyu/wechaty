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
 */
import { EventEmitter } from 'events';
import { StateSwitch } from 'state-switch';
import { HeadName } from '../config';
import { BrowserDriver, IWebDriverOptionsCookie } from './browser-driver';
export interface BrowserSetting {
    head: HeadName;
    sessionFile?: string;
}
export declare class Browser extends EventEmitter {
    private setting;
    private cookie;
    driver: BrowserDriver;
    state: StateSwitch<"open", "close">;
    constructor(setting?: BrowserSetting);
    toString(): string;
    init(): Promise<void>;
    hostname(): Promise<string | null>;
    open(url?: string): Promise<void>;
    refresh(): Promise<void>;
    restart(): Promise<void>;
    quit(): Promise<void>;
    clean(kill?: boolean): Promise<void>;
    getBrowserPidList(): Promise<number[]>;
    execute(script: any, ...args: any[]): Promise<any>;
    executeAsync(script: any, ...args: any[]): Promise<any>;
    /**
     *
     * check whether browser is full functional
     *
     */
    readyLive(): Promise<boolean>;
    dead(forceReason?: any): boolean;
    clickSwitchAccount(): Promise<boolean>;
    addCookie(cookies: IWebDriverOptionsCookie[]): Promise<void>;
    addCookie(cookie: IWebDriverOptionsCookie): Promise<void>;
    saveCookie(): Promise<void>;
    loadCookie(): Promise<void>;
    readCookie(): Promise<IWebDriverOptionsCookie[]>;
    cleanCookie(): Promise<void>;
}
export { IWebDriverOptionsCookie };
export default Browser;
