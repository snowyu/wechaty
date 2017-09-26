import { BrowserDriver, IWebDriverOptionsCookie } from './browser-driver';
/**
 * The reason that driverCookie type defined here
 * is because @types/selenium is not updated
 * with the latest 3.0 version of selenium.
 * 201610 zixia
 */
/**
 * Updated 201708 zixia Use IWebDriverOptionsCookie from selenium instead
 */
export declare class BrowserCookie {
    private driver;
    private storeFile;
    constructor(driver: BrowserDriver, storeFile?: string | undefined);
    read(): Promise<IWebDriverOptionsCookie[]>;
    clean(): Promise<void>;
    save(): Promise<void>;
    load(): Promise<void>;
    getCookiesFromFile(): IWebDriverOptionsCookie[] | null;
    hostname(): string;
    /**
     * only wrap addCookies for convinience
     *
     * use this.driver().manage() to call other functions like:
     * deleteCookie / getCookie / getCookies
     */
    add(cookie: IWebDriverOptionsCookie | IWebDriverOptionsCookie[]): Promise<void>;
}
export default BrowserCookie;
