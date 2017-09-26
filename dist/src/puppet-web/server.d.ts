/// <reference types="node" />
/// <reference types="ws" />
/// <reference types="express" />
import { EventEmitter } from 'events';
import * as express from 'express';
import * as https from 'https';
import * as WebSocket from 'ws';
export interface WechatyBroEvent {
    name: string;
    data: string | object;
}
export declare class Server extends EventEmitter {
    private port;
    private express;
    private httpsServer;
    socketServer: WebSocket.Server | null;
    socketClient: WebSocket | null;
    constructor(port: number);
    toString(): string;
    init(): Promise<void>;
    /**
     * Https Server
     */
    createHttpsServer(expressApp: express.Application): Promise<https.Server>;
    /**
     * express Middleware
     */
    createExpress(): express.Application;
    /**
     * Socket IO
     */
    createWebSocketServer(httpsServer: any): WebSocket.Server;
    private initEventsFromClient(client);
    quit(): Promise<void>;
}
export default Server;
export { Server as PuppetWebServer };
