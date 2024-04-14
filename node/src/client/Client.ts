import * as axios from "axios";
import * as ofetch from "ofetch";
import * as base64 from "js-base64";
import Websocket from "isomorphic-ws";

import { kernel } from "@/types";

import constants from "@/constants";
import { HTTPError } from "@/errors/http";
import { KernelError } from "@/errors/kernel";

/* 基础设置选项 */
export interface IBaseOptions {
    /**
     * 思源服务 base URL
     * REF: https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/base
     */
    baseURL?: string,
    /**
     * 思源 API Token
     * REF: https://github.com/siyuan-note/siyuan/blob/master/API.md#Authentication
     */
    token?: string,
}

export interface IBlob extends Blob {
    contentType: string | null;
}

/* 扩展设置选项 */
export type ExtendOptions = ofetch.FetchOptions | axios.AxiosRequestConfig;

/* 完整设置选项 */
// export type IOptions = (IBaseOptions & axios.AxiosRequestConfig) | (IBaseOptions & ofetch.FetchOptions);
export type FetchOptions = IBaseOptions & ofetch.FetchOptions;
export type AxiosOptions = IBaseOptions & axios.AxiosRequestConfig;
export type Options = FetchOptions | AxiosOptions;

/* HTTP 请求客户端类型 */
export type ClientType = "fetch" | "xhr";

/* 响应类型 */
export type FetchResponseType =
    "arrayBuffer" |
    "blob" |
    "json" |
    "stream" |
    "text";
export type ResponseType = axios.ResponseType | FetchResponseType;

/* 全局设置选项 */
export type GlobalOptions = {
    type: "fetch",
    options: FetchOptions,
} | {
    type: "xhr",
    options: AxiosOptions,
};

/* 临时设置选项 */
export interface TempFetchOptions {
    type: "fetch",
    options?: ofetch.FetchOptions,
}
export interface TempAxiosOptions {
    type: "xhr",
    options?: axios.AxiosRequestConfig,
}
export type TempOptions = TempFetchOptions | TempAxiosOptions;

export interface IFetch {
    $fetch: typeof fetch;
}

export class Client implements IFetch {
    public static readonly ws = {
        broadcast: { pathname: "/ws/broadcast" },
    } as const;

    public static readonly api = {
        asset: {
            upload: { pathname: "/api/asset/upload", method: "POST" },
        },
        attr: {
            getBlockAttrs: { pathname: "/api/attr/getBlockAttrs", method: "POST" },
            getBookmarkLabels: { pathname: "/api/attr/getBookmarkLabels", method: "POST" },
            setBlockAttrs: { pathname: "/api/attr/setBlockAttrs", method: "POST" },
        },
        block: {
            appendBlock: { pathname: "/api/block/appendBlock", method: "POST" },
            deleteBlock: { pathname: "/api/block/deleteBlock", method: "POST" },
            foldBlock: { pathname: "/api/block/foldBlock", method: "POST" },
            getBlockBreadcrumb: { pathname: "/api/block/getBlockBreadcrumb", method: "POST" },
            getBlockDOM: { pathname: "/api/block/getBlockDOM", method: "POST" },
            getBlockInfo: { pathname: "/api/block/getBlockInfo", method: "POST" },
            getBlockKramdown: { pathname: "/api/block/getBlockKramdown", method: "POST" },
            getChildBlocks: { pathname: "/api/block/getChildBlocks", method: "POST" },
            getDocInfo: { pathname: "/api/block/getDocInfo", method: "POST" },
            insertBlock: { pathname: "/api/block/insertBlock", method: "POST" },
            moveBlock: { pathname: "/api/block/moveBlock", method: "POST" },
            prependBlock: { pathname: "/api/block/prependBlock", method: "POST" },
            transferBlockRef: { pathname: "/api/block/transferBlockRef", method: "POST" },
            unfoldBlock: { pathname: "/api/block/unfoldBlock", method: "POST" },
            updateBlock: { pathname: "/api/block/updateBlock", method: "POST" },
        },
        broadcast: {
            getChannelInfo: { pathname: "/api/broadcast/getChannelInfo", method: "POST" },
            getChannels: { pathname: "/api/broadcast/getChannels", method: "POST" },
            postMessage: { pathname: "/api/broadcast/postMessage", method: "POST" },
        },
        convert: {
            pandoc: { pathname: "/api/convert/pandoc", method: "POST" },
        },
        export: {
            exportMdContent: { pathname: "/api/export/exportMdContent", method: "POST" },
            exportResources: { pathname: "/api/export/exportResources", method: "POST" },
            exportHTML: { pathname: "/api/export/exportHTML", method: "POST" },
        },
        file: {
            getFile: { pathname: "/api/file/getFile", method: "POST" },
            putFile: { pathname: "/api/file/putFile", method: "POST" },
            readDir: { pathname: "/api/file/readDir", method: "POST" },
            removeFile: { pathname: "/api/file/removeFile", method: "POST" },
            renameFile: { pathname: "/api/file/renameFile", method: "POST" },
        },
        filetree: {
            createDailyNote: { pathname: "/api/filetree/createDailyNote", method: "POST" },
            createDocWithMd: { pathname: "/api/filetree/createDocWithMd", method: "POST" },
            getDoc: { pathname: "/api/filetree/getDoc", method: "POST" },
            getHPathByID: { pathname: "/api/filetree/getHPathByID", method: "POST" },
            getHPathByPath: { pathname: "/api/filetree/getHPathByPath", method: "POST" },
            getIDsByHPath: { pathname: "/api/filetree/getIDsByHPath", method: "POST" },
            listDocsByPath: { pathname: "/api/filetree/listDocsByPath", method: "POST" },
            moveDocs: { pathname: "/api/filetree/moveDocs", method: "POST" },
            removeDoc: { pathname: "/api/filetree/removeDoc", method: "POST" },
            renameDoc: { pathname: "/api/filetree/renameDoc", method: "POST" },
            searchDocs: { pathname: "/api/filetree/searchDocs", method: "POST" },
        },
        history: {
            getDocHistoryContent: { pathname: "/api/history/getDocHistoryContent", method: "POST" },
            getHistoryItems: { pathname: "/api/history/getHistoryItems", method: "POST" },
        },
        inbox: {
            getShorthand: { pathname: "/api/inbox/getShorthand", method: "POST" },
        },
        network: {
            echo: { pathname: "/api/network/echo", method: "POST" },
            forwardProxy: { pathname: "/api/network/forwardProxy", method: "POST" },
        },
        notebook: {
            closeNotebook: { pathname: "/api/notebook/closeNotebook", method: "POST" },
            createNotebook: { pathname: "/api/notebook/createNotebook", method: "POST" },
            getNotebookConf: { pathname: "/api/notebook/getNotebookConf", method: "POST" },
            lsNotebooks: { pathname: "/api/notebook/lsNotebooks", method: "POST" },
            openNotebook: { pathname: "/api/notebook/openNotebook", method: "POST" },
            removeNotebook: { pathname: "/api/notebook/removeNotebook", method: "POST" },
            renameNotebook: { pathname: "/api/notebook/renameNotebook", method: "POST" },
            setNotebookConf: { pathname: "/api/notebook/setNotebookConf", method: "POST" },
        },
        notification: {
            pushErrMsg: { pathname: "/api/notification/pushErrMsg", method: "POST" },
            pushMsg: { pathname: "/api/notification/pushMsg", method: "POST" },
        },
        outline: {
            getDocOutline: { pathname: "/api/outline/getDocOutline", method: "POST" },
        },
        query: {
            sql: { pathname: "/api/query/sql", method: "POST" },
        },
        repo: {
            openRepoSnapshotDoc: { pathname: "/api/repo/openRepoSnapshotDoc", method: "POST" },
        },
        search: {
            fullTextSearchBlock: { pathname: "/api/search/fullTextSearchBlock", method: "POST" },
        },
        snippet: {
            getSnippet: { pathname: "/api/snippet/getSnippet", method: "POST" },
            setSnippet: { pathname: "/api/snippet/setSnippet", method: "POST" },
        },
        sqlite: {
            flushTransaction: { pathname: "/api/sqlite/flushTransaction", method: "POST" },
        },
        storage: {
            getLocalStorage: { pathname: "/api/storage/getLocalStorage", method: "POST" },
            getRecentDocs: { pathname: "/api/storage/getRecentDocs", method: "POST" },
            setLocalStorage: { pathname: "/api/storage/setLocalStorage", method: "POST" },
            setLocalStorageVal: { pathname: "/api/storage/setLocalStorageVal", method: "POST" },
        },
        system: {
            bootProgress: { pathname: "/api/system/bootProgress", method: "POST" },
            currentTime: { pathname: "/api/system/currentTime", method: "POST" },
            exit: { pathname: "/api/system/exit", method: "POST" },
            getConf: { pathname: "/api/system/getConf", method: "POST" },
            logoutAuth: { pathname: "/api/system/logoutAuth", method: "POST" },
            version: { pathname: "/api/system/version", method: "POST" },
        },
        template: {
            render: { pathname: "/api/template/render", method: "POST" },
            renderSprig: { pathname: "/api/template/renderSprig", method: "POST" },
        },
    } as const;

    public static headers2record(headers: Headers): Record<string, string> {
        const record: Record<string, string> = {};
        headers.forEach((value, key) => {
            record[key] = value;
        });
        return record;
    }

    public static headers2records(headers: Headers): Record<string, string>[] {
        const records: Record<string, string>[] = [];
        headers.forEach((value, key) => {
            records.push({ [key]: value });
        });
        return records;
    }

    public static headers2entries(headers: { [key: string]: string[] }): Array<[string, string]> {
        const entries: Array<[string, string]> = [];
        Object.entries(headers).forEach(([key, values]) => {
            values.forEach(value => entries.push([key, value]));
        });
        return entries;
    }

    public static entries2record(entries: IterableIterator<[string, string]> | Array<[string, string]>): Record<string, string> {
        const record: Record<string, string> = {};
        for (const [key, value] of entries) {
            record[key] = value;
        }
        return record;
    }

    protected _type: ClientType = "xhr";

    protected _baseURL: string = globalThis.top?.document?.baseURI
        ?? globalThis.parent?.document?.baseURI
        ?? globalThis.location?.origin
        ?? constants.SIYUAN_DEFAULT_BASE_URL;

    protected _token: string = constants.SIYUAN_DEFAULT_TOKEN;

    public _axios = axios.default.create({
        baseURL: this._baseURL,
        timeout: constants.REQUEST_TIMEOUT,
        headers: {
            Authorization: `Token ${this._token}`,
        },
    });

    public _fetch = ofetch.ofetch.create({
        baseURL: this._baseURL,
        headers: {
            Authorization: `Token ${this._token}`,
        },
    });

    constructor(
        options?: FetchOptions,
        type?: Extract<ClientType, "fetch">,
    );
    constructor(
        options?: AxiosOptions,
        type?: Extract<ClientType, "xhr">,
    );
    constructor(
        options: Options = {}, // 全局设置选项
        type: ClientType = "xhr", // HTTP 请求客户端类型
    ) {
        this._setClientType(type);
        // @ts-ignore
        this._updateOptions(options, type);
    }

    /* 设置默认使用的客户端类型 */
    public _setClientType(type: ClientType): void {
        this._type = type;
    }

    /* 更新配置 */
    public _updateOptions(
        options: FetchOptions,
        type: Extract<ClientType, "fetch">,
    ): void;
    public _updateOptions<T extends Extract<ClientType, "fetch">>(
        options: FetchOptions,
        type?: T,
    ): void;
    public _updateOptions(
        options: AxiosOptions,
        type: Extract<ClientType, "xhr">,
    ): void;
    public _updateOptions<T extends Extract<ClientType, "xhr">>(
        options: AxiosOptions,
        type?: T,
    ): void;
    public _updateOptions(
        options: Options,
        type: ClientType = this._type,
    ): void {
        this._token = options.token ?? this._token;
        this._baseURL = options.baseURL ?? this._baseURL;

        switch (type) {
            case "fetch":
                const ofetch_options = options as FetchOptions;
                if (ofetch_options.token) {
                    const header_name = "Authorization";
                    const header_value = `Token ${options.token}`;
                    if (Array.isArray(ofetch_options.headers)) {
                        ofetch_options.headers.push([
                            header_name,
                            header_value,
                        ]);
                    }
                    else if (ofetch_options.headers instanceof Headers) {
                        ofetch_options.headers.set(
                            header_name,
                            header_value,
                        );
                    }
                    else if (typeof ofetch_options.headers === "object") {
                        ofetch_options.headers[header_name] = header_value;
                    }
                    else {
                        ofetch_options.headers = {
                            [header_name]: header_value,
                        };
                    }
                    delete options.token;
                }
                this._fetch = this._fetch.create(ofetch_options);
                break;
            case "xhr":
            default:
                for (const [key, value] of Object.entries(options)) {
                    switch (key) {
                        case "token":
                            this._axios.defaults.headers.Authorization = `Token ${this._token}`;
                            break;
                        default:
                            this._axios.defaults[key as keyof axios.AxiosRequestConfig] = value;
                            break;
                    }
                }
                break;
        }
        this._baseURL = options.baseURL ?? this._baseURL;
    }

    /**
     * 兼容 fetch 接口的 forwardProxy 调用方案
     * @param input {@link fetch} 的第一个参数
     * @param init {@link fetch} 的第二个参数
     * @returns {} {@link fetch} 的返回值
     */
    public async $fetch(
        input: URL | RequestInfo,
        init?: RequestInit,
    ): Promise<Response> {
        // REF: https://developer.mozilla.org/zh-CN/docs/Web/API/Request/Request
        const request = new Request(input, init);
        const response = await this.forwardProxy({
            url: request.url,
            method: request.method as kernel.api.network.forwardProxy.TRequestMethod,
            headers: Client.headers2records(request.headers),
            payload: base64.fromUint8Array(new Uint8Array(await request.arrayBuffer())),
            timeout: constants.REQUEST_TIMEOUT,
            contentType: "application/json",
            payloadEncoding: "base64",
            responseEncoding: "base64",
        });
        // REF: https://developer.mozilla.org/zh-CN/docs/Web/API/Response/Response
        return new Response(base64.toUint8Array(response.data.body), {
            status: response.data.status,
            statusText: response.msg,
            headers: new Headers(Client.headers2entries(response.data.headers)),
        });
    }

    /* 👇 WebSocket 👇 */
    /* 消息广播 */
    public broadcast(
        params: kernel.ws.broadcast.IParams | URLSearchParams,
        protocols?: string | string[],
        config?: IBaseOptions,
    ): WebSocket {
        const baseURL = config?.baseURL ?? this._baseURL;
        const token = config?.token ?? this._token;

        const searchParams = new URLSearchParams(params);
        token && searchParams.set("token", token);

        const url = new URL(baseURL);
        url.protocol = url.protocol.replace(/^http/, "ws");
        url.pathname = url.pathname.endsWith("/")
            ? `${url.pathname}${Client.ws.broadcast.pathname.substring(1)}`
            : `${url.pathname}${Client.ws.broadcast.pathname}`;
        url.search = searchParams.toString();

        return new Websocket(url, protocols);
    }

    /* 👇 由 JSON Schema 生成的类型定义👇 */
    /* 上传资源文件 */
    public async upload(
        payload: kernel.api.asset.upload.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.asset.upload.IResponse> {
        const formdata = new FormData();
        formdata.append("assetsDirPath", payload.assetsDirPath ?? "/assets/");
        payload.files.forEach(file => formdata.append("file[]", file));

        const response = await this._request(
            Client.api.asset.upload.pathname,
            Client.api.asset.upload.method,
            formdata,
            config,
        ) as kernel.api.asset.upload.IResponse;
        return response;
    }

    /* 获取块属性 */
    public async getBlockAttrs(
        payload: kernel.api.attr.getBlockAttrs.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.attr.getBlockAttrs.IResponse> {
        const response = await this._request(
            Client.api.attr.getBlockAttrs.pathname,
            Client.api.attr.getBlockAttrs.method,
            payload,
            config,
        ) as kernel.api.attr.getBlockAttrs.IResponse;
        return response;
    }

    /* 获取所有书签 */
    public async getBookmarkLabels(
        config?: TempOptions,
    ): Promise<kernel.api.attr.getBookmarkLabels.IResponse> {
        const response = await this._request(
            Client.api.attr.getBookmarkLabels.pathname,
            Client.api.attr.getBookmarkLabels.method,
            undefined,
            config,
        ) as kernel.api.attr.getBookmarkLabels.IResponse;
        return response;
    }

    /* 设置块属性 */
    public async setBlockAttrs(
        payload: kernel.api.attr.setBlockAttrs.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.attr.setBlockAttrs.IResponse> {
        const response = await this._request(
            Client.api.attr.setBlockAttrs.pathname,
            Client.api.attr.setBlockAttrs.method,
            payload,
            config,
        ) as kernel.api.attr.setBlockAttrs.IResponse;
        return response;
    }

    /* 在下级块尾部插入块 */
    public async appendBlock(
        payload: kernel.api.block.appendBlock.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.block.appendBlock.IResponse> {
        const response = await this._request(
            Client.api.block.appendBlock.pathname,
            Client.api.block.appendBlock.method,
            payload,
            config,
        ) as kernel.api.block.appendBlock.IResponse;
        return response;
    }

    /* 删除块 */
    public async deleteBlock(
        payload: kernel.api.block.deleteBlock.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.block.deleteBlock.IResponse> {
        const response = await this._request(
            Client.api.block.deleteBlock.pathname,
            Client.api.block.deleteBlock.method,
            payload,
            config,
        ) as kernel.api.block.deleteBlock.IResponse;
        return response;
    }

    /* 折叠块 */
    public async foldBlock(
        payload: kernel.api.block.foldBlock.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.block.foldBlock.IResponse> {
        const response = await this._request(
            Client.api.block.foldBlock.pathname,
            Client.api.block.foldBlock.method,
            payload,
            config,
        ) as kernel.api.block.foldBlock.IResponse;
        return response;
    }

    /* 获得块面包屑 */
    public async getBlockBreadcrumb(
        payload: kernel.api.block.getBlockBreadcrumb.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.block.getBlockBreadcrumb.IResponse> {
        const response = await this._request(
            Client.api.block.getBlockBreadcrumb.pathname,
            Client.api.block.getBlockBreadcrumb.method,
            payload,
            config,
        ) as kernel.api.block.getBlockBreadcrumb.IResponse;
        return response;
    }

    /* 获得块的 DOM */
    public async getBlockDOM(
        payload: kernel.api.block.getBlockDOM.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.block.getBlockDOM.IResponse> {
        const response = await this._request(
            Client.api.block.getBlockDOM.pathname,
            Client.api.block.getBlockDOM.method,
            payload,
            config,
        ) as kernel.api.block.getBlockDOM.IResponse;
        return response;
    }

    /* 获得块所在文档的信息 */
    public async getBlockInfo(
        payload: kernel.api.block.getBlockInfo.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.block.getBlockInfo.IResponse> {
        const response = await this._request(
            Client.api.block.getBlockInfo.pathname,
            Client.api.block.getBlockInfo.method,
            payload,
            config,
        ) as kernel.api.block.getBlockInfo.IResponse;
        return response;
    }

    /* 获得块的 kramdown 源码 */
    public async getBlockKramdown(
        payload: kernel.api.block.getBlockKramdown.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.block.getBlockKramdown.IResponse> {
        const response = await this._request(
            Client.api.block.getBlockKramdown.pathname,
            Client.api.block.getBlockKramdown.method,
            payload,
            config,
        ) as kernel.api.block.getBlockKramdown.IResponse;
        return response;
    }

    /* 获得指定块的所有下级块 */
    public async getChildBlocks(
        payload: kernel.api.block.getChildBlocks.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.block.getChildBlocks.IResponse> {
        const response = await this._request(
            Client.api.block.getChildBlocks.pathname,
            Client.api.block.getChildBlocks.method,
            payload,
            config,
        ) as kernel.api.block.getChildBlocks.IResponse;
        return response;
    }

    /* 获得指定块所在文档信息 */
    public async getDocInfo(
        payload: kernel.api.block.getDocInfo.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.block.getDocInfo.IResponse> {
        const response = await this._request(
            Client.api.block.getDocInfo.pathname,
            Client.api.block.getDocInfo.method,
            payload,
            config,
        ) as kernel.api.block.getDocInfo.IResponse;
        return response;
    }

    /* 插入块 */
    public async insertBlock(
        payload: kernel.api.block.insertBlock.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.block.insertBlock.IResponse> {
        const response = await this._request(
            Client.api.block.insertBlock.pathname,
            Client.api.block.insertBlock.method,
            payload,
            config,
        ) as kernel.api.block.insertBlock.IResponse;
        return response;
    }

    /* 移动块 */
    public async moveBlock(
        payload: kernel.api.block.moveBlock.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.block.moveBlock.IResponse> {
        const response = await this._request(
            Client.api.block.moveBlock.pathname,
            Client.api.block.moveBlock.method,
            payload,
            config,
        ) as kernel.api.block.moveBlock.IResponse;
        return response;
    }

    /* 在下级块首部插入块 */
    public async prependBlock(
        payload: kernel.api.block.prependBlock.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.block.prependBlock.IResponse> {
        const response = await this._request(
            Client.api.block.prependBlock.pathname,
            Client.api.block.prependBlock.method,
            payload,
            config,
        ) as kernel.api.block.prependBlock.IResponse;
        return response;
    }

    /* 转移块引用 */
    public async transferBlockRef(
        payload: kernel.api.block.transferBlockRef.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.block.transferBlockRef.IResponse> {
        const response = await this._request(
            Client.api.block.transferBlockRef.pathname,
            Client.api.block.transferBlockRef.method,
            payload,
            config,
        ) as kernel.api.block.transferBlockRef.IResponse;
        return response;
    }

    /* 展开块 */
    public async unfoldBlock(
        payload: kernel.api.block.unfoldBlock.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.block.unfoldBlock.IResponse> {
        const response = await this._request(
            Client.api.block.unfoldBlock.pathname,
            Client.api.block.unfoldBlock.method,
            payload,
            config,
        ) as kernel.api.block.unfoldBlock.IResponse;
        return response;
    }

    /* 更新块 */
    public async updateBlock(
        payload: kernel.api.block.updateBlock.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.block.updateBlock.IResponse> {
        const response = await this._request(
            Client.api.block.updateBlock.pathname,
            Client.api.block.updateBlock.method,
            payload,
            config,
        ) as kernel.api.block.updateBlock.IResponse;
        return response;
    }

    /* 获取指定广播频道的信息 */
    public async getChannelInfo(
        payload: kernel.api.broadcast.getChannelInfo.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.broadcast.getChannelInfo.IResponse> {
        const response = await this._request(
            Client.api.broadcast.getChannelInfo.pathname,
            Client.api.broadcast.getChannelInfo.method,
            payload,
            config,
        ) as kernel.api.broadcast.getChannelInfo.IResponse;
        return response;
    }

    /* 获取所有广播频道信息 */
    public async getChannels(
        config?: TempOptions,
    ): Promise<kernel.api.broadcast.getChannels.IResponse> {
        const response = await this._request(
            Client.api.broadcast.getChannels.pathname,
            Client.api.broadcast.getChannels.method,
            undefined,
            config,
        ) as kernel.api.broadcast.getChannels.IResponse;
        return response;
    }

    /* 推送广播消息 */
    public async postMessage(
        payload: kernel.api.broadcast.postMessage.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.broadcast.postMessage.IResponse> {
        const response = await this._request(
            Client.api.broadcast.postMessage.pathname,
            Client.api.broadcast.postMessage.method,
            payload,
            config,
        ) as kernel.api.broadcast.postMessage.IResponse;
        return response;
    }

    /* 调用 pandoc 转换转换文件 */
    public async pandoc(
        payload: kernel.api.convert.pandoc.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.convert.pandoc.IResponse> {
        const response = await this._request(
            Client.api.convert.pandoc.pathname,
            Client.api.convert.pandoc.method,
            payload,
            config,
        ) as kernel.api.convert.pandoc.IResponse;
        return response;
    }

    /* 打包文件与文件夹以导出 */
    public async exportResources(
        payload: kernel.api.export.exportResources.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.export.exportResources.IResponse> {
        const response = await this._request(
            Client.api.export.exportResources.pathname,
            Client.api.export.exportResources.method,
            payload,
            config,
        ) as kernel.api.export.exportResources.IResponse;
        return response;
    }

    /* 导出指定文档块为 Markdown */
    public async exportMdContent(
        payload: kernel.api.export.exportMdContent.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.export.exportMdContent.IResponse> {
        const response = await this._request(
            Client.api.export.exportMdContent.pathname,
            Client.api.export.exportMdContent.method,
            payload,
            config,
        ) as kernel.api.export.exportMdContent.IResponse;
        return response;
    }

    /* 导出指定文档块为 HTML */
    public async exportHTML(
        payload: kernel.api.export.exportHTML.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.export.exportHTML.IResponse> {
        const response = await this._request(
            Client.api.export.exportHTML.pathname,
            Client.api.export.exportHTML.method,
            payload,
            config,
        ) as kernel.api.export.exportHTML.IResponse;
        return response;
    }

    /* 获取文件 */
    public async getFile(
        payload: kernel.api.file.getFile.IPayload,
        responseType: Extract<ResponseType, "arrayBuffer" | "arraybuffer">,
        config?: TempOptions,
    ): Promise<ArrayBuffer>;
    public async getFile(
        payload: kernel.api.file.getFile.IPayload,
        responseType: Extract<ResponseType, "blob">,
        config?: TempOptions,
    ): Promise<IBlob>;
    public async getFile(
        payload: kernel.api.file.getFile.IPayload,
        responseType: Extract<ResponseType, "document">,
        config?: TempOptions,
    ): Promise<Document>;
    public async getFile(
        payload: kernel.api.file.getFile.IPayload,
        responseType: Extract<ResponseType, "json">,
        config?: TempOptions,
    ): Promise<Object>;
    public async getFile<R = any>(
        payload: kernel.api.file.getFile.IPayload,
        responseType: Extract<ResponseType, "stream">,
        config?: TempOptions,
    ): Promise<ReadableStream<R>>;
    public async getFile(
        payload: kernel.api.file.getFile.IPayload,
        responseType: Extract<ResponseType, "text">,
        config?: TempOptions,
    ): Promise<string>;
    public async getFile(
        payload: kernel.api.file.getFile.IPayload,
        responseType: ResponseType,
        config?: TempOptions,
    ): Promise<
        ArrayBuffer
        | IBlob
        | Document
        | Object
        | ReadableStream
        | string
    >;

    public async getFile<R>(
        payload: kernel.api.file.getFile.IPayload,
        responseType: ResponseType = "text",
        config?: TempOptions,
    ): Promise<R> {
        const response: R = await this._request(
            Client.api.file.getFile.pathname,
            Client.api.file.getFile.method,
            payload,
            config,
            false,
            responseType,
        );
        return response;
    }

    /* 设置文件 */
    public async putFile(
        payload: kernel.api.file.putFile.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.file.putFile.IResponse> {
        /**
         * 若文件不是 File 类型，则转换为 File 类型
         * REF: https://developer.mozilla.org/zh-CN/docs/Web/API/File/File
         */
        if (payload.file !== undefined && !(payload.file instanceof File)) {
            payload.file = new File(
                [payload.file],
                payload.path.split("/").pop()!,
            );
        }

        // REF: https://axios-http.com/zh/docs/post_example
        const formdata = new FormData();
        for (const [key, value] of Object.entries(payload)) {
            if (payload.hasOwnProperty(key)) {
                if (value instanceof Blob) {
                    formdata.append(key, value);
                }
                else {
                    formdata.append(key, String(value));
                }
            }
        }

        const response = await this._request(
            Client.api.file.putFile.pathname,
            Client.api.file.putFile.method,
            formdata,
            config,
        ) as kernel.api.file.putFile.IResponse;
        return response;
    }

    /* 获取文件目录下级内容 */
    public async readDir(
        payload: kernel.api.file.readDir.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.file.readDir.IResponse> {
        const response = await this._request(
            Client.api.file.readDir.pathname,
            Client.api.file.readDir.method,
            payload,
            config,
        ) as kernel.api.file.readDir.IResponse;
        return response;
    }

    /* 删除文件/目录 */
    public async removeFile(
        payload: kernel.api.file.removeFile.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.file.removeFile.IResponse> {
        const response = await this._request(
            Client.api.file.removeFile.pathname,
            Client.api.file.removeFile.method,
            payload,
            config,
        ) as kernel.api.file.removeFile.IResponse;
        return response;
    }

    /* 重命名/移动文件/目录 */
    public async renameFile(
        payload: kernel.api.file.renameFile.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.file.renameFile.IResponse> {
        const response = await this._request(
            Client.api.file.renameFile.pathname,
            Client.api.file.renameFile.method,
            payload,
            config,
        ) as kernel.api.file.renameFile.IResponse;
        return response;
    }

    /* 创建今天的每日笔记 (Daily Note) */
    public async createDailyNote(
        payload: kernel.api.filetree.createDailyNote.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.filetree.createDailyNote.IResponse> {
        const response = await this._request(
            Client.api.filetree.createDailyNote.pathname,
            Client.api.filetree.createDailyNote.method,
            payload,
            config,
        ) as kernel.api.filetree.createDailyNote.IResponse;
        return response;
    }

    /* 通过 Markdown 创建文档 */
    public async createDocWithMd(
        payload: kernel.api.filetree.createDocWithMd.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.filetree.createDocWithMd.IResponse> {
        const response = await this._request(
            Client.api.filetree.createDocWithMd.pathname,
            Client.api.filetree.createDocWithMd.method,
            payload,
            config,
        ) as kernel.api.filetree.createDocWithMd.IResponse;
        return response;
    }

    /* 获取文档内容 */
    public async getDoc(
        payload: kernel.api.filetree.getDoc.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.filetree.getDoc.IResponse> {
        const response = await this._request(
            Client.api.filetree.getDoc.pathname,
            Client.api.filetree.getDoc.method,
            payload,
            config,
        ) as kernel.api.filetree.getDoc.IResponse;
        return response;
    }

    /* 根据 ID 获取人类可读路径 */
    public async getHPathByID(
        payload: kernel.api.filetree.getHPathByID.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.filetree.getHPathByID.IResponse> {
        const response = await this._request(
            Client.api.filetree.getHPathByID.pathname,
            Client.api.filetree.getHPathByID.method,
            payload,
            config,
        ) as kernel.api.filetree.getHPathByID.IResponse;
        return response;
    }

    /* 根据路径获取人类可读路径 */
    public async getHPathByPath(
        payload: kernel.api.filetree.getHPathByPath.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.filetree.getHPathByPath.IResponse> {
        const response = await this._request(
            Client.api.filetree.getHPathByPath.pathname,
            Client.api.filetree.getHPathByPath.method,
            payload,
            config,
        ) as kernel.api.filetree.getHPathByPath.IResponse;
        return response;
    }

    /* 根据人类可读路径获取文档 ID 列表 */
    public async getIDsByHPath(
        payload: kernel.api.filetree.getIDsByHPath.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.filetree.getIDsByHPath.IResponse> {
        const response = await this._request(
            Client.api.filetree.getIDsByHPath.pathname,
            Client.api.filetree.getIDsByHPath.method,
            payload,
            config,
        ) as kernel.api.filetree.getIDsByHPath.IResponse;
        return response;
    }

    /* 查询子文档 */
    public async listDocsByPath(
        payload: kernel.api.filetree.listDocsByPath.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.filetree.listDocsByPath.IResponse> {
        const response = await this._request(
            Client.api.filetree.listDocsByPath.pathname,
            Client.api.filetree.listDocsByPath.method,
            payload,
            config,
        ) as kernel.api.filetree.listDocsByPath.IResponse;
        return response;
    }

    /* 批量移动文档 */
    public async moveDocs(
        payload: kernel.api.filetree.moveDocs.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.filetree.moveDocs.IResponse> {
        const response = await this._request(
            Client.api.filetree.moveDocs.pathname,
            Client.api.filetree.moveDocs.method,
            payload,
            config,
        ) as kernel.api.filetree.moveDocs.IResponse;
        return response;
    }

    /* 删除文档 */
    public async removeDoc(
        payload: kernel.api.filetree.removeDoc.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.filetree.removeDoc.IResponse> {
        const response = await this._request(
            Client.api.filetree.removeDoc.pathname,
            Client.api.filetree.removeDoc.method,
            payload,
            config,
        ) as kernel.api.filetree.removeDoc.IResponse;
        return response;
    }

    /* 文档重命名 */
    public async renameDoc(
        payload: kernel.api.filetree.renameDoc.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.filetree.renameDoc.IResponse> {
        const response = await this._request(
            Client.api.filetree.renameDoc.pathname,
            Client.api.filetree.renameDoc.method,
            payload,
            config,
        ) as kernel.api.filetree.renameDoc.IResponse;
        return response;
    }

    /* 搜索文档 */
    public async searchDocs(
        payload: kernel.api.filetree.searchDocs.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.filetree.searchDocs.IResponse> {
        const response = await this._request(
            Client.api.filetree.searchDocs.pathname,
            Client.api.filetree.searchDocs.method,
            payload,
            config,
        ) as kernel.api.filetree.searchDocs.IResponse;
        return response;
    }

    /* 获取历史文档内容 */
    public async getDocHistoryContent(
        payload: kernel.api.history.getDocHistoryContent.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.history.getDocHistoryContent.IResponse> {
        const response = await this._request(
            Client.api.history.getDocHistoryContent.pathname,
            Client.api.history.getDocHistoryContent.method,
            payload,
            config,
        ) as kernel.api.history.getDocHistoryContent.IResponse;
        return response;
    }

    /* 查询历史项 */
    public async getHistoryItems(
        payload: kernel.api.history.getHistoryItems.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.history.getHistoryItems.IResponse> {
        const response = await this._request(
            Client.api.history.getHistoryItems.pathname,
            Client.api.history.getHistoryItems.method,
            payload,
            config,
        ) as kernel.api.history.getHistoryItems.IResponse;
        return response;
    }

    /* 收集箱速记内容 */
    public async getShorthand(
        payload: kernel.api.inbox.getShorthand.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.inbox.getShorthand.IResponse> {
        const response = await this._request(
            Client.api.inbox.getShorthand.pathname,
            Client.api.inbox.getShorthand.method,
            payload,
            config,
        ) as kernel.api.inbox.getShorthand.IResponse;
        return response;
    }

    /* 回显请求内容 */
    public async echo(
        payload?: kernel.api.network.echo.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.network.echo.IResponse> {
        if (payload) {
            config ??= {
                type: this._type,
            };
            switch (config?.type) {
                case "fetch": {
                    const options: FetchOptions = {};
                    if (payload.headers) {
                        options.headers = payload.headers;
                    }
                    if (payload.query) {
                        options.query = Client.entries2record(payload.query.entries());
                    }
                    if (config.options) {
                        Object.assign(options, config.options);
                    }
                    else {
                        config.options = options;
                    }
                    break;
                }
                case "xhr": {
                    const options: AxiosOptions = {};
                    if (payload.headers) {
                        options.headers = (Array.isArray(payload.headers)
                            ? Client.entries2record(payload.headers)
                            : (payload.headers instanceof Headers
                                ? Client.headers2record(payload.headers)
                                : payload.headers
                            )
                        );
                    }
                    if (payload.query) {
                        options.params = payload.query;
                    }
                    if (config.options) {
                        Object.assign(options, config.options);
                    }
                    else {
                        config.options = options;
                    }
                    break;
                }
            }
        }

        const response = await this._request(
            Client.api.network.echo.pathname,
            payload?.method ?? Client.api.network.echo.method,
            payload?.body,
            config,
        ) as kernel.api.network.echo.IResponse;
        return response;
    }

    /* 正向代理 */
    public async forwardProxy(
        payload: kernel.api.network.forwardProxy.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.network.forwardProxy.IResponse> {
        const response = await this._request(
            Client.api.network.forwardProxy.pathname,
            Client.api.network.forwardProxy.method,
            payload,
            config,
        ) as kernel.api.network.forwardProxy.IResponse;
        return response;
    }

    /* 关闭笔记本 */
    public async closeNotebook(
        payload: kernel.api.notebook.closeNotebook.IPayload,
        config?: TempOptions
    ): Promise<kernel.api.notebook.closeNotebook.IResponse> {
        const response = await this._request(
            Client.api.notebook.closeNotebook.pathname,
            Client.api.notebook.closeNotebook.method,
            payload,
            config,
        ) as kernel.api.notebook.closeNotebook.IResponse;
        return response;
    }

    /* 创建笔记本 */
    public async createNotebook(
        payload: kernel.api.notebook.createNotebook.IPayload,
        config?: TempOptions
    ): Promise<kernel.api.notebook.createNotebook.IResponse> {
        const response = await this._request(
            Client.api.notebook.createNotebook.pathname,
            Client.api.notebook.createNotebook.method,
            payload,
            config,
        ) as kernel.api.notebook.createNotebook.IResponse;
        return response;
    }

    /* 获取笔记本配置信息 */
    public async getNotebookConf(
        payload: kernel.api.notebook.getNotebookConf.IPayload,
        config?: TempOptions
    ): Promise<kernel.api.notebook.getNotebookConf.IResponse> {
        const response = await this._request(
            Client.api.notebook.getNotebookConf.pathname,
            Client.api.notebook.getNotebookConf.method,
            payload,
            config,
        ) as kernel.api.notebook.getNotebookConf.IResponse;
        return response;
    }

    /* 列出笔记本信息 */
    public async lsNotebooks(
        config?: TempOptions,
    ): Promise<kernel.api.notebook.lsNotebooks.IResponse> {
        const response = await this._request(
            Client.api.notebook.lsNotebooks.pathname,
            Client.api.notebook.lsNotebooks.method,
            undefined,
            config,
        ) as kernel.api.notebook.lsNotebooks.IResponse;
        return response;
    }

    /* 打开笔记本 */
    public async openNotebook(
        payload: kernel.api.notebook.openNotebook.IPayload,
        config?: TempOptions
    ): Promise<kernel.api.notebook.openNotebook.IResponse> {
        const response = await this._request(
            Client.api.notebook.openNotebook.pathname,
            Client.api.notebook.openNotebook.method,
            payload,
            config,
        ) as kernel.api.notebook.openNotebook.IResponse;
        return response;
    }

    /* 删除笔记本 */
    public async removeNotebook(
        payload: kernel.api.notebook.removeNotebook.IPayload,
        config?: TempOptions
    ): Promise<kernel.api.notebook.removeNotebook.IResponse> {
        const response = await this._request(
            Client.api.notebook.removeNotebook.pathname,
            Client.api.notebook.removeNotebook.method,
            payload,
            config,
        ) as kernel.api.notebook.removeNotebook.IResponse;
        return response;
    }

    /* 重命名笔记本 */
    public async renameNotebook(
        payload: kernel.api.notebook.renameNotebook.IPayload,
        config?: TempOptions
    ): Promise<kernel.api.notebook.renameNotebook.IResponse> {
        const response = await this._request(
            Client.api.notebook.renameNotebook.pathname,
            Client.api.notebook.renameNotebook.method,
            payload,
            config,
        ) as kernel.api.notebook.renameNotebook.IResponse;
        return response;
    }

    /* 设置笔记本配置 */
    public async setNotebookConf(
        payload: kernel.api.notebook.setNotebookConf.IPayload,
        config?: TempOptions
    ): Promise<kernel.api.notebook.setNotebookConf.IResponse> {
        const response = await this._request(
            Client.api.notebook.setNotebookConf.pathname,
            Client.api.notebook.setNotebookConf.method,
            payload,
            config,
        ) as kernel.api.notebook.setNotebookConf.IResponse;
        return response;
    }

    /* 推送错误消息 */
    public async pushErrMsg(
        payload: kernel.api.notification.pushErrMsg.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.notification.pushErrMsg.IResponse> {
        const response = await this._request(
            Client.api.notification.pushErrMsg.pathname,
            Client.api.notification.pushErrMsg.method,
            payload,
            config,
        ) as kernel.api.notification.pushErrMsg.IResponse;
        return response;
    }

    /* 推送提示消息 */
    public async pushMsg(
        payload: kernel.api.notification.pushMsg.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.notification.pushMsg.IResponse> {
        const response = await this._request(
            Client.api.notification.pushMsg.pathname,
            Client.api.notification.pushMsg.method,
            payload,
            config,
        ) as kernel.api.notification.pushMsg.IResponse;
        return response;
    }

    /* 获取文档大纲 */
    public async getDocOutline(
        payload: kernel.api.outline.getDocOutline.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.outline.getDocOutline.IResponse> {
        const response = await this._request(
            Client.api.outline.getDocOutline.pathname,
            Client.api.outline.getDocOutline.method,
            payload,
            config,
        ) as kernel.api.outline.getDocOutline.IResponse;
        return response;
    }

    /* SQL 查询 */
    public async sql(
        payload: kernel.api.query.sql.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.query.sql.IResponse> {
        const response = await this._request(
            Client.api.query.sql.pathname,
            Client.api.query.sql.method,
            payload,
            config,
        ) as kernel.api.query.sql.IResponse;
        return response;
    }

    /* 读取快照文件内容 */
    public async openRepoSnapshotDoc(
        payload: kernel.api.repo.openRepoSnapshotDoc.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.repo.openRepoSnapshotDoc.IResponse> {
        const response = await this._request(
            Client.api.repo.openRepoSnapshotDoc.pathname,
            Client.api.repo.openRepoSnapshotDoc.method,
            payload,
            config,
        ) as kernel.api.repo.openRepoSnapshotDoc.IResponse;
        return response;
    }

    /* 全局搜索 */
    public async fullTextSearchBlock(
        payload: kernel.api.search.fullTextSearchBlock.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.search.fullTextSearchBlock.IResponse> {
        const response = await this._request(
            Client.api.search.fullTextSearchBlock.pathname,
            Client.api.search.fullTextSearchBlock.method,
            payload,
            config,
        ) as kernel.api.search.fullTextSearchBlock.IResponse;
        return response;
    }

    /* 获取代码片段 */
    public async getSnippet(
        payload: kernel.api.snippet.getSnippet.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.snippet.getSnippet.IResponse> {
        const response = await this._request(
            Client.api.snippet.getSnippet.pathname,
            Client.api.snippet.getSnippet.method,
            payload,
            config,
        ) as kernel.api.snippet.getSnippet.IResponse;
        return response;
    }

    /* 设置代码片段 */
    public async setSnippet(
        payload: kernel.api.snippet.setSnippet.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.snippet.setSnippet.IResponse> {
        const response = await this._request(
            Client.api.snippet.setSnippet.pathname,
            Client.api.snippet.setSnippet.method,
            payload,
            config,
        ) as kernel.api.snippet.setSnippet.IResponse;
        return response;
    }

    /* 等待业务数据持久化完成 */
    public async flushTransaction(
        config?: TempOptions,
    ): Promise<kernel.api.sqlite.flushTransaction.IResponse> {
        const response = await this._request(
            Client.api.sqlite.flushTransaction.pathname,
            Client.api.sqlite.flushTransaction.method,
            config,
        ) as kernel.api.sqlite.flushTransaction.IResponse;
        return response;
    }

    /* 获取所有本地存储的数据 */
    public async getLocalStorage(
        config?: TempOptions,
    ): Promise<kernel.api.storage.getLocalStorage.IResponse> {
        const response = await this._request(
            Client.api.storage.getLocalStorage.pathname,
            Client.api.storage.getLocalStorage.method,
            undefined,
            config,
        ) as kernel.api.storage.getLocalStorage.IResponse;
        return response;
    }

    /* 查询最近打开的文档 */
    public async getRecentDocs(
        config?: TempOptions,
    ): Promise<kernel.api.storage.getRecentDocs.IResponse> {
        const response = await this._request(
            Client.api.storage.getRecentDocs.pathname,
            Client.api.storage.getRecentDocs.method,
            undefined,
            config,
        ) as kernel.api.storage.getRecentDocs.IResponse;
        return response;
    }

    /* 持久化本地存储 */
    public async setLocalStorage(
        payload: kernel.api.storage.setLocalStorage.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.storage.setLocalStorage.IResponse> {
        const response = await this._request(
            Client.api.storage.setLocalStorage.pathname,
            Client.api.storage.setLocalStorage.method,
            payload,
            config,
        ) as kernel.api.storage.setLocalStorage.IResponse;
        return response;
    }

    /* 持久化一项本地存储 */
    public async setLocalStorageVal(
        payload: kernel.api.storage.setLocalStorageVal.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.storage.setLocalStorageVal.IResponse> {
        const response = await this._request(
            Client.api.storage.setLocalStorageVal.pathname,
            Client.api.storage.setLocalStorageVal.method,
            payload,
            config,
        ) as kernel.api.storage.setLocalStorageVal.IResponse;
        return response;
    }

    /* 获取内核启动进度 */
    public async bootProgress(
        config?: TempOptions,
    ): Promise<kernel.api.system.bootProgress.IResponse> {
        const response = await this._request(
            Client.api.system.bootProgress.pathname,
            Client.api.system.bootProgress.method,
            undefined,
            config,
        ) as kernel.api.system.bootProgress.IResponse;
        return response;
    }

    /* 获得内核 Unix 时间戳 (单位: ms) */
    public async currentTime(
        config?: TempOptions,
    ): Promise<kernel.api.system.currentTime.IResponse> {
        const response = await this._request(
            Client.api.system.currentTime.pathname,
            Client.api.system.currentTime.method,
            undefined,
            config,
        ) as kernel.api.system.currentTime.IResponse;
        return response;
    }

    /* 退出内核 */
    public async exit(
        payload: kernel.api.system.exit.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.system.exit.IResponse> {
        const response = await this._request(
            Client.api.system.exit.pathname,
            Client.api.system.exit.method,
            payload,
            config,
        ) as kernel.api.system.exit.IResponse;
        return response;
    }

    /* 获得配置 */
    public async getConf(
        config?: TempOptions,
    ): Promise<kernel.api.system.getConf.IResponse> {
        const response = await this._request(
            Client.api.system.getConf.pathname,
            Client.api.system.getConf.method,
            undefined,
            config,
        ) as kernel.api.system.getConf.IResponse;
        return response;
    }

    /* 注销登录状态 */
    public async logoutAuth(
        config?: TempOptions,
    ): Promise<kernel.api.system.logoutAuth.IResponse> {
        const response = await this._request(
            Client.api.system.logoutAuth.pathname,
            Client.api.system.logoutAuth.method,
            undefined,
            config,
        ) as kernel.api.system.logoutAuth.IResponse;
        return response;
    }

    /* 获得内核版本 */
    public async version(
        config?: TempOptions,
    ): Promise<kernel.api.system.version.IResponse> {
        const response = await this._request(
            Client.api.system.version.pathname,
            Client.api.system.version.method,
            undefined,
            config,
        ) as kernel.api.system.version.IResponse;
        return response;
    }

    /* 渲染 kramdown 模板文件 */
    public async render(
        payload: kernel.api.template.render.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.template.render.IResponse> {
        const response = await this._request(
            Client.api.template.render.pathname,
            Client.api.template.render.method,
            payload,
            config,
        ) as kernel.api.template.render.IResponse;
        return response;
    }

    /* 渲染 Sprig 模板 */
    public async renderSprig(
        payload: kernel.api.template.renderSprig.IPayload,
        config?: TempOptions,
    ): Promise<kernel.api.template.renderSprig.IResponse> {
        const response = await this._request(
            Client.api.template.renderSprig.pathname,
            Client.api.template.renderSprig.method,
            payload,
            config,
        ) as kernel.api.template.renderSprig.IResponse;
        return response;
    }

    public async _request<P extends kernel.kernel.IPayload, R>(
        pathname: string,
        method: string,
        payload?: P,
        config?: TempOptions,
        normal?: true,
        responseType?: "json",
    ): Promise<R>;
    public async _request<P extends kernel.kernel.IPayload, R>(
        pathname: string,
        method: string,
        payload?: P,
        config?: TempOptions,
        normal?: boolean,
        responseType?: ResponseType,
    ): Promise<R>;
    public async _request<P extends kernel.kernel.IPayload, R>(
        pathname: string,
        method: string,
        payload?: P,
        config?: TempOptions,
        normal: boolean = true,
        responseType: ResponseType = "json",
    ): Promise<R> {
        try {
            switch (config?.type ?? this._type) {
                case "fetch": {
                    const options = config?.options as FetchOptions | undefined;
                    responseType = (() => {
                        switch (responseType) {
                            case "arraybuffer":
                                return "arrayBuffer";
                            case "document":
                                return "text";
                            default:
                                return responseType;
                        }
                    })();
                    const response = await this._fetch<R, FetchResponseType>(
                        pathname,
                        {
                            method,
                            body: payload,
                            responseType,
                            onResponse: async (context) => {
                                switch (context.response.status) {
                                    case axios.HttpStatusCode.Ok:
                                        switch (responseType) {
                                            case "blob":
                                                (context.response._data as IBlob).contentType = context.response.headers.get("content-type");
                                                break;
                                            default:
                                                break;
                                        }
                                        break;

                                    case axios.HttpStatusCode.Accepted:
                                        /* api/file/getFile */
                                        if (pathname === Client.api.file.getFile.pathname) {
                                            this._parseFetchResponse(context.response._data);
                                        }
                                        break;

                                    default:
                                        break;
                                }
                            },
                            ...options,
                        },
                    );
                    if (normal && responseType === "json" && typeof response === "object") {
                        return this._parseFetchResponse(response as kernel.kernel.IResponse) as R;
                    }
                    else {
                        return response as R;
                    }
                }
                case "xhr":
                default: {
                    const options = config?.options as AxiosOptions | undefined;
                    responseType = (() => {
                        switch (responseType) {
                            case "arrayBuffer":
                                return "arraybuffer";
                            default:
                                return responseType;
                        }
                    })();
                    const response = await this._axios.request<R>({
                        url: pathname,
                        method,
                        data: payload,
                        responseType,
                        ...options,
                    });
                    switch (response.status) {
                        case axios.HttpStatusCode.Ok:
                            if (normal && responseType === "json" && typeof response.data === "object") {
                                return this._parseAxiosResponse(response as axios.AxiosResponse<kernel.kernel.IResponse>) as R;
                            }
                            else {
                                switch (responseType) {
                                    case "blob":
                                        // @ts-ignore
                                        (response.data as IBlob).contentType = response.headers.getContentType() as string;
                                        break;
                                    default:
                                        break;
                                }
                                return response.data;
                            }

                        case axios.HttpStatusCode.Accepted:
                            /* api/file/getFile */
                            if (pathname === Client.api.file.getFile.pathname) {
                                return this._parseAxiosResponse(response as axios.AxiosResponse<kernel.kernel.IResponse>) as R;
                            }
                            else {
                                return response.data;
                            }

                        default:
                            const error = new HTTPError(response);
                            throw error;
                    }
                }
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * 解析内核响应
     */
    protected _parseFetchResponse<T extends kernel.kernel.IResponse>(response: T): T {
        if (response.code === 0) { // 内核正常响应
            return response;
        }
        else { // 内核异常响应
            const error = new KernelError(response);
            throw error;
        }
    }

    /**
     * 解析内核响应
     */
    protected _parseAxiosResponse<T extends kernel.kernel.IResponse>(response: axios.AxiosResponse<T>): T {
        if (response.data.code === 0) { // 内核正常响应
            return response.data;
        }
        else { // 内核异常响应
            const error = new KernelError(response.data, response);
            throw error;
        }
    }
}
