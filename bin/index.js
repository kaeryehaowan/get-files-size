#!/usr/bin/env node
const {getFilesSize, unitsFn} = require('../src/main')
const program = require('commander')
const chalk = require('chalk')
const log = console.log;

function list(val) {
    return val.split(',')
}

program
.version('1.0.0')
.usage('<folder/files> [options]')
.option('-p, --path <path>', 'folder/file path')
.option('-t, --type <type>', 'file extname, for example: css,js,png', list)
.option('-u, --unit <unit>', 'size unit: B K M G')
.option('-i, --ignore <ignore>', 'ignore path regexp')
.option('-c, --chalk', 'log')
.parse(process.argv);

if(!program.args.length&&!program.opts().path){
    log(chalk.red('[getFilesSize]: path error'))
    process.exit(1)
}
let _path = program.opts().path ? program.opts().path : program.args[0]
let _options = Object.assign({
    type: null,
    unit: 'B',
    chalk: false,
    ignore: null
},program.opts())

if(_options.ignore){
    _options.ignore = new RegExp(_options.ignore)
}
getFilesSize(_path, _options, (err, size, paths) => {
    if(!err){
        if(_options.chalk){
            Object.keys(paths).forEach(p => {
                log(chalk.yellowBright(p+': ')+chalk.green.bold(unitsFn[_options.unit](paths[p])))
            })
            log(chalk.yellowBright(`ALL[${_path}]: `)+chalk.green.bold(size))
        }else{
            log(chalk.yellowBright(`${_path}: `)+chalk.green.bold(size))
        }
    }
})