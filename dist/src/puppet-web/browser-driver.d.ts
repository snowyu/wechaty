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
import { By, IWebDriverOptionsCookie, Navigation, Options, promise as promiseManager, Session, TargetLocator, WebDriver } from 'selenium-webdriver';
import { HeadName } from '../config';
export declare class BrowserDriver {
    private head;
    driver: WebDriver;
    constructor(head: HeadName);
    init(): Promise<void>;
    getWebDriver(): WebDriver;
    private getChromeDriver(headless?);
    private getPhantomJsDriver();
    private valid(driver);
    private validDriverExecute(driver);
    private validDriverSession(driver);
    close(): promiseManager.Promise<void>;
    executeAsyncScript(script: string | Function, ...args: any[]): any;
    executeScript(script: string | Function, ...args: any[]): any;
    get(url: string): promiseManager.Promise<void>;
    getSession(): promiseManager.Promise<Session>;
    manage(): Options;
    navigate(): Navigation;
    quit(): promiseManager.Promise<void>;
    switchTo(): TargetLocator;
}
export { By, IWebDriverOptionsCookie, Session, TargetLocator };
export default BrowserDriver;
