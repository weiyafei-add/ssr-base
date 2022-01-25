const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { cssModules, modifyVars, postcssConfig, browsers } = require('../resolveConfig');
const postcssPresetEnv = require('postcss-preset-env');

const modulesOption = {
    localIdentName: '[local]_[hash:base64:5]',
    // ???
    auto(filename) {
        return filename.indexOf('node_modules') === -1;
    }
}

const webCSSConfig = [
    {
        loader: MiniCssExtractPlugin.loader,
    },
    {
        loader: 'css-loader',
        options: { modules: cssModules === true ? modulesOption : cssModules }
    }
]

const config = {
    postcssOptions: {
        plugins: [
            postcssPresetEnv({ browsers, autoprefixer: {} })
        ]
    }
}

const lessConfig = {
    loader: 'less-loader',
    options: {
        lessOptions: {
            modifyVars,
            javascriptEnabled: true,
        }
    }
}

if (typeof postcssConfig === 'function') {
    postcssConfig(config); // 调用业务线postcss配置
}

const postcss = { loader: 'postcss-loader', options: config }

const webStyleConfig = [
    {
        test: /\.css$/,
        use: webCSSConfig
    },
    {
        test: /\.less$/,
        use: [
            ...webCSSConfig,
            lessConfig
        ]
    }
]

/******** */

/**
 * exportOnlyLocals 类型：Boolean 默认：false        仅导出局部环境。

使用 css 模块 进行预渲染（例如 SSR）时很有用。 要进行预渲染，预渲染包 应使用 mini-css-extract-plugin 选项而不是 style-loader!css-loader。 它不嵌入 CSS，而仅导出标识符映射。
 */

const nodeCssConfig = [
    {
        loader: 'css-loader',
        options: { modules: { ...modulesOption }, exportOnlyLocals: true }
    }
]

const nodeStyleConfig = [
    {
        test: /\.css$/,
        use: nodeCssConfig
    },
    {
        test: /\.less$/,
        use: [
            ...nodeCssConfig,
            lessConfig
        ]
    }
]

module.exports = {
    webStyleConfig,
    nodeStyleConfig,
}