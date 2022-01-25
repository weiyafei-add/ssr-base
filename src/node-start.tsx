import React from 'react';
import { renderToString } from 'react-dom/server';
import { configType } from './types'
import { Request } from 'express';
export { SSRPage } from './types';
import { clientName } from '../build/static';


const getRouterConfig = (req: Request) => {
    let { headers, path, protocol, url, query } = req;
    const { host } = headers;
    // 经过转发的协议 || protocol
    const proto = headers['x-forwarded-proto'] || protocol;
    const origin = proto + "://" + host;
    return {
        href: origin + url,
        path,
        origin,
        query,
        type: query.type || 'page', // 可以作为script标签使用
    }
}

const getComponentProperty = (component, key) => {
    if (!component) {
        return null;
    }
    if (component[key]) {
        return component[key];
    }
    if (component.WrappedComponent) {
        return component.WrappedComponent[key];
    }
    return null;
}

const getAssets = (manifest, chunkName) => {
    const { publicPath, namedChunkGroups } = manifest;
    const css = [];
    const scripts = [];
    namedChunkGroups[chunkName].assets.forEach(item => {
        const src = item.name;
        if (src.endsWith('.css')) {
            css.push(publicPath + src);
        } else if (/(?<!\.hot-update)\.js$/.test(src)) {
            scripts.push(publicPath + src);
        }
    })
    namedChunkGroups[clientName].assets.forEach((item) => {
        const src = item.name;
        if (src.endsWith('.css')) {
            css.unshift(publicPath + src);
        } else if (/(?<!\.hot-update)\.js$/.test(src)) {
            scripts.push(publicPath + src);
        }
    })

    return { css, scripts };
}

const PageComponent = props => {
    const { data, css, scripts, component, headContent } = props;
    const { rootId = 'root' } = data.router.query;
    const Component = component;
    return (
        <html lang='en'>
            <head>
                {headContent}
                {css.map(src => <link key={src} rel='stylesheet' href={src} />)}
            </head>
            <body>
                <div id={rootId}><Component {...data} /></div>
                <script type='text/javascript'
                    dangerouslySetInnerHTML={{ __html: `window.INITSTATE=${JSON.stringify(data)}` }}
                />
                {scripts.map(src => <script key={src} src={src} />)}
            </body>
        </html>
    )
}

const getJsCode = ({ data, css, scripts }) => {
    return null
}

export default function start(config: configType) {
    const getRoute = function (path) {
        const { publicPath = '', routes } = config;
        return routes.find(item => {
            return path === publicPath + item.path;
        })
    }

    const getHeadContent = function (req, component) {
        const commHead = config.headContent;
        const headContent = getComponentProperty(component, 'headContent')

        return (
            <>
                {typeof commHead === 'function' ? commHead(req) : (commHead || null)}
                {typeof headContent === 'function' ? headContent(req) : (headContent || null)}
            </>
        )
    }

    const { publicPath, createRequest, errorInterceptor } = config;

    return async function (req, res, next, manifest) {
        // 与正则不匹配，则跳到下一个中间件
        if (publicPath && !new RegExp('^' + publicPath + '(/|&)').test(req.path)) {
            return next();
        }
        // 业务端路由描述
        const route = getRoute(req.path);

        if (!route) {
            // 没有找到路由： 1. 执行业务端代码。2. 跳到错误处理中间件
            if (typeof errorInterceptor === 'function') {
                return errorInterceptor({ status: 404 }, req, res, next);
            }
            return next({ status: 404 });
        }
        // 获取路由配置信息
        const routerConfig = getRouterConfig(req);

        try {
            // 获取组件
            const { default: component, __webpack_chunkname_ } = await route.getComponent();

            const data = { route: routerConfig };
            const getInitialData = getComponentProperty(component, 'getInitialData');

            if (typeof getInitialData === 'function') {
                if (typeof createRequest === 'function') {
                    Object.assign(data, await getInitialData(createRequest(req), req, res));
                } else {
                    Object.assign(data, await getInitialData(req, res));
                }
            }

            const { css, scripts } = getAssets(manifest, __webpack_chunkname_);

            if (routerConfig.type === 'page') {
                const htmlString = renderToString(
                    <PageComponent
                        data={data}
                        css={css}
                        scripts={scripts}
                        component={component}
                        headContent={getHeadContent(req, component)}
                    />
                )
                res.send("<!DOCTYPE html>" + htmlString)
            } else {
                res.send(getJsCode({ data, css, scripts }))
            }
        } catch (error) {

        }
    }
}