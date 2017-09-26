/**
 * Raven.io
 */
import * as Raven from 'raven';
import { log, Loggable } from 'brolog';
import { Puppet } from './puppet';
export declare type PuppetName = 'web' | 'android' | 'ios';
export declare type HeadName = 'chrome' | 'chrome-headless' | 'phantomjs' | 'firefox';
export interface ConfigSetting {
    DEFAULT_HEAD: HeadName;
    DEFAULT_PUPPET: PuppetName;
    DEFAULT_APIHOST: string;
    DEFAULT_PROFILE: string;
    DEFAULT_TOKEN: string;
    DEFAULT_PROTOCOL: string;
    CMD_CHROMIUM: string;
    DEFAULT_PORT: number;
    port: number;
    profile: string;
    token: string;
    debug: boolean;
    puppet: PuppetName;
    head: HeadName;
    apihost: string;
    validApiHost: (host: string) => boolean;
    httpPort: number;
    _puppetInstance: Puppet | null;
    puppetInstance(): Puppet;
    puppetInstance(empty: null): void;
    puppetInstance(instance: Puppet): void;
    puppetInstance(instance?: Puppet | null): Puppet | void;
    gitVersion(): string | null;
    npmVersion(): string;
    dockerMode: boolean;
}
export declare const config: ConfigSetting;
export declare type WatchdogFoodName = 'HEARTBEAT' | 'POISON' | 'SCAN';
export interface WatchdogFood {
    data: any;
    timeout?: number;
    type?: WatchdogFoodName;
}
export interface ScanInfo {
    url: string;
    code: number;
}
/**
 * from Message
 */
export interface RecommendInfo {
    UserName: string;
    NickName: string;
    Content: string;
    HeadImgUrl: string;
    Ticket: string;
    VerifyFlag: number;
}
export interface Sayable {
    say(content: string, replyTo?: any | any[]): Promise<boolean>;
}
export interface Sleepable {
    sleep(millisecond: number): Promise<void>;
}
export { log, Loggable, Raven };
export default config;
