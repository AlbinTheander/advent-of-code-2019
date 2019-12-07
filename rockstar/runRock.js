const fs = require('fs');
const satriani = require('./rockstar/satriani/satriani.js');

const programFile = process.argv[2];
const inputFile = process.argv[3];

const program = fs.readFileSync(programFile, 'utf-8');
const inputLines = fs.readFileSync(inputFile, 'utf-8').split('\n');

const input = () => inputLines.shift();
const output = console.log

const rockstar = new satriani.Interpreter();
const ast = rockstar.parse(program);
rockstar.run(ast, input, output);


