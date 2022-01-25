import React from 'react';
import ReactDom from 'react-dom';
import { configType } from './types';
export { SSRPage } from './types';

export default function (config: configType) {

    function getRoute(path) {
        const { publicPath = '', routes } = config;
        return routes.find((item) => {
            return path === publicPath + item.path;
        })
    }

    async function render(data, renderMethod) {
        const { query: { rootId = 'root' }, path } = data.router;
        const { getComponent } = getRoute(path);
        const { default: Component } = await getComponent();
        renderMethod(
            <Component {...data} />, document.getElementById(rootId)
        )
    }

    const initState = (window as any).INITSTATE;
    if (Array.isArray(initState)) {
        const renderGroup = () => {
            while (initState.length) {
                const data = initState.shift();
                render(data, ReactDom.hydrate);
            }
        }
        // ？？？
        (initState as any).push = (...arg) => {
            Array.prototype.push.apply(initState, arg);
            renderGroup();
        }
        renderGroup();
    } else {
        render(initState, ReactDom.hydrate);
    }
}