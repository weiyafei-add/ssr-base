import { ComponentClass, FunctionComponent, ReactNode } from "react";
import { Request, Response, NextFunction } from "express";
declare type headContentType = ReactNode | ((req: Request) => ReactNode);
declare type dataType<T> = {
    [K in keyof T]: T[K];
};
interface baseData {
    router: {
        href: string;
        path: string;
        origin: string;
        query: object;
        type: "page" | "module";
    };
}
export interface getInitialDataType<T> {
    (http: any, req: Request, res: Response): Promise<T>;
}
export interface pageFC<T> extends FunctionComponent<dataType<T> & baseData> {
    getInitialData: getInitialDataType<T>;
    headContent?: headContentType;
}
export interface pageCC<T> extends ComponentClass<dataType<T> & baseData> {
    getInitialData: getInitialDataType<T>;
    headContent?: headContentType;
}
export declare type SSRPage<T = any> = pageFC<T> | pageCC<T>;
export interface routeType {
    path: string;
    getComponent: () => Promise<{
        default: SSRPage;
        __webpack_chunkname_?: string;
    }>;
}
export interface configType {
    publicPath?: string;
    headContent?: headContentType;
    createRequest?: (req: Request) => any;
    errorInterceptor?: (error: any, req: Request, res: Response, next: NextFunction) => void;
    routes: routeType[];
}
export {};
