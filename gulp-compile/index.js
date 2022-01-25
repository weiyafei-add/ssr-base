const gulp = require('gulp');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');
const merge2 = require('merge2');
const getBabelConfig = require('./getBabelConfig');

function dest(stream, out) {
    const output = Array.isArray(out) ? out : [out];

    return output.reduce((stream, current) => {
        return stream.pipe(gulp.dest(current));
    }, stream)
}

function buildTs({ stream, modules, outDir }) {
    // 创建ts流
    const tsResult = stream.pipe(ts({
        "allowSyntheticDefaultImports": true,
        "target": 'ESNext',
        "module": 'ESNext',
        "jsx": "preserve",
        "moduleResolution": "node",
        "skipLibCheck": true,
        "noImplicitAny": false,
        "declaration": true,
    }));

    return dest(
        // 将两个流合并为一个流
        merge2([
            tsResult.js.pipe(babel(getBabelConfig(modules))).pipe(gulp.dest(outDir)),
            tsResult.dts.pipe(gulp.dest(outDir)),
        ]),
        outDir,
    )
}

exports.buildTs = buildTs;
