#!/usr/bin/env node

const { argv } = process;
console.log(argv);
const arg = argv[2];

if (arg === 'build') {
    require('./build/build');
} else {
    require('./build/devServer');
}