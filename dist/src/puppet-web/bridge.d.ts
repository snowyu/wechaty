import PuppetWeb from './puppet-web';
import { MsgRawObj } from '../message';
export interface MediaData {
    ToUserName: string;
    MsgType: number;
    MediaId: string;
    FileName: string;
    FileSize: number;
    FileMd5?: string;
    MMFileId: string;
    MMFileExt: string;
}
export declare class Bridge {
    private puppet;
    private port;
    constructor(puppet: PuppetWeb, port: number);
    toString(): string;
    init(): Promise<Bridge>;
    inject(): Promise<any>;
    getInjectio(): string;
    logout(): Promise<any>;
    quit(): Promise<void>;
    getUserName(): Promise<string>;
    contactRemark(contactId: string, remark: string | null): Promise<boolean>;
    contactFind(filterFunc: string): Promise<string[]>;
    roomFind(filterFunc: string): Promise<string[]>;
    roomDelMember(roomId: any, contactId: any): Promise<number>;
    roomAddMember(roomId: any, contactId: any): Promise<number>;
    roomModTopic(roomId: any, topic: any): Promise<string>;
    roomCreate(contactIdList: string[], topic?: string): Promise<string>;
    verifyUserRequest(contactId: any, hello: any): Promise<boolean>;
    verifyUserOk(contactId: any, ticket: any): Promise<boolean>;
    send(toUserName: string, content: string): Promise<boolean>;
    getMsgImg(id: any): Promise<string>;
    getMsgEmoticon(id: any): Promise<string>;
    getMsgVideo(id: any): Promise<string>;
    getMsgVoice(id: any): Promise<string>;
    getMsgPublicLinkImg(id: any): Promise<string>;
    getContact(id: string): Promise<string>;
    getBaseRequest(): Promise<string>;
    getPassticket(): Promise<string>;
    getUploadMediaUrl(): Promise<string>;
    sendMedia(mediaData: MediaData): Promise<boolean>;
    forward(baseData: MsgRawObj, patchData: MsgRawObj): Promise<boolean>;
    /**
     * Proxy Call to Wechaty in Bridge
     */
    proxyWechaty(wechatyFunc: any, ...args: any[]): Promise<any>;
    /**
     * call REAL browser excute for other methods
     */
    execute(script: any, ...args: any[]): Promise<any>;
    private executeAsync(script, ...args);
    ding(data: any): Promise<any>;
    /**
     * <error>
     *  <ret>1203</ret>
     *  <message>当前登录环境异常。为了你的帐号安全，暂时不能登录web微信。你可以通过手机客户端或者windows微信登录。</message>
     * </error>
     */
    blockedMessageBody(): Promise<string | null>;
    blockedMessageAlert(): Promise<string | null>;
}
export default Bridge;
