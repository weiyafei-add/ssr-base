const fs = require('fs');
const path = require('path');
const rootDir = process.cwd();
// 业务线名称
const name = require(rootDir + '/package.json').name;

const configPath = path.resolve(rootDir, './leke.config.js');

const config = {
    publicPath: '/lib/' + name,
    cssModules: false,
    browsers: [
        "last 2 versions",
        "ie >= 11"
    ]
}

const alias = {};
const devServer = {
    port: 9999,
    serverIndex: false,
    host: 'localhost',
}

if (fs.existsSync(configPath)) {
    //  业务线中的leke.config.js 配置
    const setting = require(configPath);
    Object.assign(alias, setting.alias);
    Object.assign(devServer, setting.devServer);
    Object.assign(config, setting, { alias, devServer });
}

const { publicPath, entry } = config;
// 如果没有以/结尾
if (!/\/$/.test(publicPath)) {
    config.publicPath = publicPath + '/';
}

config.resolveEntry = (...arg) => {
    const absolute = path.isAbsolute(entry) ? entry : path.join(rootDir, entry);
    return [...arg, absolute];
}

module.exports = config;