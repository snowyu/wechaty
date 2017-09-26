/// <reference types="node" />
import { Readable } from 'stream';
import { RecommendInfo, Sayable } from './config';
import Contact from './contact';
import Room from './room';
export interface MsgRawObj {
    MsgId: string;
    MMActualSender: string;
    MMPeerUserName: string;
    ToUserName: string;
    FromUserName: string;
    MMActualContent: string;
    Content: string;
    MMDigest: string;
    MMDisplayTime: number;
    /**
     * MsgType == MSGTYPE_APP && message.AppMsgType == CONF.APPMSGTYPE_URL
     * class="cover" mm-src="{{getMsgImg(message.MsgId,'slave')}}"
     */
    Url: string;
    MMAppMsgDesc: string;
    /**
     * Attachment
     *
     * MsgType == MSGTYPE_APP && message.AppMsgType == CONF.APPMSGTYPE_ATTACH
     */
    FileName: string;
    FileSize: number;
    MediaId: string;
    MMAppMsgFileExt: string;
    MMAppMsgFileSize: string;
    MMAppMsgDownloadUrl: string;
    MMUploadProgress: number;
    /**
     * 模板消息
     * MSGTYPE_APP && message.AppMsgType == CONF.APPMSGTYPE_READER_TYPE
     *  item.url
     *  item.title
     *  item.pub_time
     *  item.cover
     *  item.digest
     */
    MMCategory: any[];
    /**
     * Type
     *
     * MsgType == CONF.MSGTYPE_VOICE : ng-style="{'width':40 + 7*message.VoiceLength/1000}
     */
    MsgType: number;
    AppMsgType: AppMsgType;
    SubMsgType: MsgType;
    /**
     * Status-es
     */
    Status: string;
    MMStatus: number;
    MMFileStatus: number;
    /**
     * Location
     */
    MMLocationUrl: string;
    MMLocationDesc: string;
    /**
     * MsgType == CONF.MSGTYPE_EMOTICON
     *
     * getMsgImg(message.MsgId,'big',message)
     */
    /**
     * Image
     *
     *  getMsgImg(message.MsgId,'slave')
     */
    MMImgStyle: string;
    MMPreviewSrc: string;
    MMThumbSrc: string;
    /**
     * Friend Request & ShareCard ?
     *
     * MsgType == CONF.MSGTYPE_SHARECARD" ng-click="showProfile($event,message.RecommendInfo.UserName)
     * MsgType == CONF.MSGTYPE_VERIFYMSG
     */
    RecommendInfo?: RecommendInfo;
    /**
     * Transpond Message
     */
    MsgIdBeforeTranspond?: string;
    isTranspond?: boolean;
    MMSourceMsgId?: string;
    sendByLocal?: boolean;
    MMSendContent?: string;
    MMIsChatRoom?: boolean;
}
export interface MsgObj {
    id: string;
    type: MsgType;
    from: string;
    to?: string;
    room?: string;
    content: string;
    status: string;
    digest: string;
    date: string;
    url?: string;
}
export interface MsgTypeMap {
    [index: string]: string | number;
}
/**
 *
 * Enum for AppMsgType values.
 *
 * @enum {number}
 * @property {number} TEXT                    - AppMsgType.TEXT                     (1)     for TEXT
 * @property {number} IMG                     - AppMsgType.IMG                      (2)      for IMG
 * @property {number} AUDIO                   - AppMsgType.AUDIO                    (3)      for AUDIO
 * @property {number} VIDEO                   - AppMsgType.VIDEO                    (4)      for VIDEO
 * @property {number} URL                     - AppMsgType.URL                      (5)      for URL
 * @property {number} ATTACH                  - AppMsgType.ATTACH                   (6)      for ATTACH
 * @property {number} OPEN                    - AppMsgType.OPEN                     (7)      for OPEN
 * @property {number} EMOJI                   - AppMsgType.EMOJI                    (8)      for EMOJI
 * @property {number} VOICE_REMIND            - AppMsgType.VOICE_REMIND             (9)      for VOICE_REMIND
 * @property {number} SCAN_GOOD               - AppMsgType.SCAN_GOOD                (10)     for SCAN_GOOD
 * @property {number} GOOD                    - AppMsgType.GOOD                     (13)     for GOOD
 * @property {number} EMOTION                 - AppMsgType.EMOTION                  (15)     for EMOTION
 * @property {number} CARD_TICKET             - AppMsgType.CARD_TICKET              (16)     for CARD_TICKET
 * @property {number} REALTIME_SHARE_LOCATION - AppMsgType.REALTIME_SHARE_LOCATION  (17)     for REALTIME_SHARE_LOCATION
 * @property {number} TRANSFERS               - AppMsgType.TRANSFERS                (2e3)    for TRANSFERS
 * @property {number} RED_ENVELOPES           - AppMsgType.RED_ENVELOPES            (2001)   for RED_ENVELOPES
 * @property {number} READER_TYPE             - AppMsgType.READER_TYPE              (100001) for READER_TYPE
 */
export declare enum AppMsgType {
    TEXT = 1,
    IMG = 2,
    AUDIO = 3,
    VIDEO = 4,
    URL = 5,
    ATTACH = 6,
    OPEN = 7,
    EMOJI = 8,
    VOICE_REMIND = 9,
    SCAN_GOOD = 10,
    GOOD = 13,
    EMOTION = 15,
    CARD_TICKET = 16,
    REALTIME_SHARE_LOCATION = 17,
    TRANSFERS = 2000,
    RED_ENVELOPES = 2001,
    READER_TYPE = 100001,
}
/**
 *
 * Enum for MsgType values.
 * @enum {number}
 * @property {number} TEXT                - MsgType.TEXT                (1)     for TEXT
 * @property {number} IMAGE               - MsgType.IMAGE               (3)     for IMAGE
 * @property {number} VOICE               - MsgType.VOICE               (34)    for VOICE
 * @property {number} VERIFYMSG           - MsgType.VERIFYMSG           (37)    for VERIFYMSG
 * @property {number} POSSIBLEFRIEND_MSG  - MsgType.POSSIBLEFRIEND_MSG  (40)    for POSSIBLEFRIEND_MSG
 * @property {number} SHARECARD           - MsgType.SHARECARD           (42)    for SHARECARD
 * @property {number} VIDEO               - MsgType.VIDEO               (43)    for VIDEO
 * @property {number} EMOTICON            - MsgType.EMOTICON            (47)    for EMOTICON
 * @property {number} LOCATION            - MsgType.LOCATION            (48)    for LOCATION
 * @property {number} APP                 - MsgType.APP                 (49)    for APP
 * @property {number} VOIPMSG             - MsgType.VOIPMSG             (50)    for VOIPMSG
 * @property {number} STATUSNOTIFY        - MsgType.STATUSNOTIFY        (51)    for STATUSNOTIFY
 * @property {number} VOIPNOTIFY          - MsgType.VOIPNOTIFY          (52)    for VOIPNOTIFY
 * @property {number} VOIPINVITE          - MsgType.VOIPINVITE          (53)    for VOIPINVITE
 * @property {number} MICROVIDEO          - MsgType.MICROVIDEO          (62)    for MICROVIDEO
 * @property {number} SYSNOTICE           - MsgType.SYSNOTICE           (9999)  for SYSNOTICE
 * @property {number} SYS                 - MsgType.SYS                 (10000) for SYS
 * @property {number} RECALLED            - MsgType.RECALLED            (10002) for RECALLED
 */
export declare enum MsgType {
    TEXT = 1,
    IMAGE = 3,
    VOICE = 34,
    VERIFYMSG = 37,
    POSSIBLEFRIEND_MSG = 40,
    SHARECARD = 42,
    VIDEO = 43,
    EMOTICON = 47,
    LOCATION = 48,
    APP = 49,
    VOIPMSG = 50,
    STATUSNOTIFY = 51,
    VOIPNOTIFY = 52,
    VOIPINVITE = 53,
    MICROVIDEO = 62,
    SYSNOTICE = 9999,
    SYS = 10000,
    RECALLED = 10002,
}
/**
 * All wechat messages will be encapsulated as a Message.
 *
 * `Message` is `Sayable`,
 * [Example/Ding-Dong-Bot]{@link https://github.com/Chatie/wechaty/blob/master/example/ding-dong-bot.ts}
 */
export declare class Message implements Sayable {
    rawObj: MsgRawObj | undefined;
    /**
     * @private
     */
    static counter: number;
    /**
     * @private
     */
    _counter: number;
    /**
     * a map for:
     *   1. name to id
     *   2. id to name
     */
    /**
     * @private
     */
    readonly id: string;
    /**
     * @private
     */
    obj: MsgObj;
    /**
     * @private
     */
    filename(): string;
    /**
     * @private
     */
    constructor(rawObj?: MsgRawObj | undefined);
    /**
     * @private
     */
    private parse(rawObj);
    /**
     * @private
     */
    toString(): string;
    /**
     * @private
     */
    toStringDigest(): string;
    /**
     * @private
     */
    toStringEx(): string;
    /**
     * @private
     */
    getSenderString(): string;
    /**
     * @private
     */
    getContentString(): string;
    say(text: string, replyTo?: Contact | Contact[]): Promise<any>;
    say(mediaMessage: MediaMessage, replyTo?: Contact | Contact[]): Promise<any>;
    /**
     * @private
     */
    from(contact: Contact): void;
    /**
     * @private
     */
    from(id: string): void;
    from(): Contact;
    /**
     * @private
     */
    room(room: Room): void;
    /**
     * @private
     */
    room(id: string): void;
    room(): Room | null;
    /**
     * Get the content of the message
     *
     * @returns {string}
     */
    content(): string;
    /**
     * @private
     */
    content(content: string): void;
    /**
     * Get the type from the message.
     *
     * If type is equal to `MsgType.RECALLED`, {@link Message#id} is the msgId of the recalled message.
     * @see {@link MsgType}
     * @returns {MsgType}
     */
    type(): MsgType;
    /**
     * Get the typeSub from the message.
     *
     * If message is a location message: `m.type() === MsgType.TEXT && m.typeSub() === MsgType.LOCATION`
     *
     * @see {@link MsgType}
     * @returns {MsgType}
     */
    typeSub(): MsgType;
    /**
     * Get the typeApp from the message.
     *
     * @returns {AppMsgType}
     * @see {@link AppMsgType}
     */
    typeApp(): AppMsgType;
    /**
     * Get the typeEx from the message.
     *
     * @returns {MsgType}
     */
    typeEx(): string;
    /**
     * @private
     */
    count(): number;
    /**
     * Check if a message is sent by self.
     *
     * @returns {boolean} - Return `true` for send from self, `false` for send from others.
     * @example
     * if (message.self()) {
     *  console.log('this message is sent by myself!')
     * }
     */
    self(): boolean;
    /**
     *
     * Get message mentioned contactList.
     *
     * Message event table as follows
     *
     * |                                                                            | Web  |  Mac PC Client | iOS Mobile |  android Mobile |
     * | :---                                                                       | :--: |     :----:     |   :---:    |     :---:       |
     * | [You were mentioned] tip ([有人@我]的提示)                                   |  ✘   |        √       |     √      |       √         |
     * | Identify magic code (8197) by copy & paste in mobile                       |  ✘   |        √       |     √      |       ✘         |
     * | Identify magic code (8197) by programming                                  |  ✘   |        ✘       |     ✘      |       ✘         |
     * | Identify two contacts with the same roomAlias by [You were  mentioned] tip |  ✘   |        ✘       |     √      |       √         |
     *
     * @returns {Contact[]} - Return message mentioned contactList
     *
     * @example
     * const contactList = message.mentioned()
     * console.log(contactList)
     */
    mentioned(): Contact[];
    /**
     * @private
     */
    ready(): Promise<void>;
    /**
     * @private
     */
    get(prop: string): string;
    /**
     * @private
     */
    set(prop: string, value: string): this;
    /**
     * @private
     */
    dump(): void;
    /**
     * @private
     */
    dumpRaw(): void;
    /**
     * @todo add function
     */
    static find(query: any): Promise<Message>;
    /**
     * @todo add function
     */
    static findAll(query: any): Promise<Message[]>;
    /**
     * @private
     */
    to(contact: Contact): void;
    /**
     * @private
     */
    to(id: string): void;
    to(): Contact | null;
    /**
     * Please notice that when we are running Wechaty,
     * if you use the browser that controlled by Wechaty to send attachment files,
     * you will get a zero sized file, because it is not an attachment from the network,
     * but a local data, which is not supported by Wechaty yet.
     *
     * @returns {Promise<Readable>}
     */
    readyStream(): Promise<Readable>;
}
/**
 * Meidia Type Message
 *
 */
export declare class MediaMessage extends Message {
    /**
     * @private
     */
    private bridge;
    /**
     * @private
     */
    private filePath;
    /**
     * @private
     */
    private fileName;
    /**
     * @private
     */
    private fileExt;
    /**
     * @private
     */
    constructor(rawObj: Object);
    /**
     * @private
     */
    constructor(filePath: string);
    /**
     * @private
     */
    ready(): Promise<void>;
    /**
     * Get the MediaMessage file extension, etc: `jpg`, `gif`, `pdf`, `word` ..
     *
     * @returns {string}
     * @example
     * bot.on('message', async function (m) {
     *   if (m instanceof MediaMessage) {
     *     console.log('media message file name extention is: ' + m.ext())
     *   }
     * })
     */
    ext(): string;
    /**
     * Get the MediaMessage filename, etc: `how to build a chatbot.pdf`..
     *
     * @returns {string}
     * @example
     * bot.on('message', async function (m) {
     *   if (m instanceof MediaMessage) {
     *     console.log('media message file name is: ' + m.filename())
     *   }
     * })
     */
    filename(): string;
    /**
     * Get the read stream for attachment file
     */
    readyStream(): Promise<Readable>;
    forward(room: Room): Promise<boolean>;
    forward(contact: Contact): Promise<boolean>;
}
export default Message;
