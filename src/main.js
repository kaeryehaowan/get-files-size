/*
 * @Author: kael 
 * @Date: 2021-01-15 21:05:45 
 * @Last Modified by: kael
 * @Last Modified time: 2021-01-17 00:07:47
 */

const Path = require('path');
const Fs = require('fs');
const eachAsync = require('tiny-each-async');
const _set = new Set;
const _paths = {};
const unitsFn = {
    B: size => `${size}B`,
    K: size => `${(size / 1024).toFixed(2)}KB`,
    M: size => `${(size / 1024 / 1024).toFixed(2)}MB`,
    G: size => `${(size / 1024 / 1024 / 1024).toFixed(2)}GB`,
}

/**
 * 
 * @param {string} path folder路径，如果传入的为 file 路径时，则只获取此 file 的大小 
 * @param {object} [options] 可选参数
 * @param {string | array} options.type 需要计算的文件类型（后缀），不传则计算全部文件，可传多个
 * @param {string} options.unit 单位，B K M G，默认为 K
 * @param {regexp} options.ignore 需要忽视的路径/文件，例如 node_modules
 * @param {boolean} options.chalk 是否需要打印
 * @param {function(err, size)} callback 
 */

function getFilesSize(path, options, callback) {
    let _options = {
        type: null,
        unit: 'K',
        chalk: false,
        ignore: null
    };
    let _callback;
    let _total = 0;

    if (!callback) {
        _callback = options;
    } else {
        _callback = callback;
        _options = Object.assign(_options, options);
    }
    if (!isArray(path) && !isString(path)) {
        let _err = new Error('[get-files-size]: path type error，it needs to be a character or an array');
        _callback(_err)
        throw _err
    }
    let _path = []
    if (isArray(path)) {
        _path = path
    } else {
        _path.push(path)
    }

    eachAsync(_path, 9999, (p, next) => {
        getSizeRecursive(p, _options, (err, size) => {
            if (!err) _total += size;
            next(err)
        })
    }, (finalErr) => {
        _callback(finalErr, unitsFn[_options.unit](_total), _options.chalk ? _paths : undefined)
    })
}

async function getSizeRecursive(path, options, callback) {
    if (options.ignore && options.ignore.test(path)) {
        return callback(null, 0)
    }
    let _total = 0;
    Fs.lstat(path, function (err, _stat) {
        if(err){
            callback(err, 0)
        }
        if (!err) {
            if (_set.has(_stat.ino)) return callback(null, 0)
            _set.add(_stat.ino)
        }

        if (!err && _stat.isDirectory()) {
            Fs.readdir(path, (err, _list) => {
                if (err) return callback(err)
                eachAsync(_list, 9999, (dirP, next) => {
                    getSizeRecursive(Path.join(path, dirP), options, (err, size) => {
                        if (!err) _total += size;
                        next(err)
                    })
                }, (finalErr) => {
                    callback(finalErr, _total)
                })
            })
        } else {
            let _err = 1
            let _type = isString(options.type) ? [options.type] : isArray(options.type) ? options.type : null
            if (_type) {
                _type = _type.map(t => '.' + (t.replace('.', '').trim()))
                _err = +!!~_type.indexOf(Path.extname(path))
            }
            if(_err&&!err){
                _paths[path] = _stat.size
            }
            callback(err, (err || !_err) ? 0 : _stat.size)
        }
    })
}



function isString(str) {
    return str && typeof str === 'string'
}
function isArray(arr) {
    return arr && Object.prototype.toString.call(arr) === '[object Array]'
}


module.exports = {
    unitsFn,
    getFilesSize
}
