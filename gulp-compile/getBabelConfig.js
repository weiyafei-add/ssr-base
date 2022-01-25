module.exports = function getBabelConfig(modules = false) {
    return {
        presets: [
            [
                "@babel/preset-env",
                {
                    modules,
                    targets: {
                        browsers: [
                            "last 2 versions",
                            "ie >= 11",
                        ]
                    }
                }
            ],
            "@babel/preset-react",
        ],
        plugins: [
            "@babel/plugin-transform-runtime", //运行时
            "@babel/plugin-transform-spread", //编译es5
            "@babel/plugin-transform-object-assign",  // 转义object.assign语法,
            "@babel/plugin-transform-template-literals", //转义模板字符串
            "@babel/plugin-proposal-object-rest-spread", // 转义...语法
            "@babel/plugin-proposal-class-properties", //这个插件可以转换静态类属性以及用属性初始化器语法声明的属性
            ["@babel/plugin-proposal-decorators", { legacy: true }], // 转换装饰器语法，
        ]
    }
}