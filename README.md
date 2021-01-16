### get-files-size
获取路径下指定类型的文件总大小，不会计算文件夹大小。例如,
└─ src
    ├── style
    |  └── a.css
    ├── js
    |  ├── index.js
    |  ├── utils.js
    |  └── shop.js
    └── package.json
有 /src 目录，目录下有 /style 与 /js 两个文件夹和一个 package.json文件。当使用 
```js
get-files-size ./src  -t js
```
只会计算 ./src/js/index.js ./src/js/utils.js ./src/js/shop.js 三个文件的大小，并相加，不会计算 ./src/js/ 文件夹的大小。

### Installation
```js
npm i get-files-size -g
```

### Usage
```js
// index.js
const getFilesSize = require('get-files-size');

getFilesSize(path, [options], function callback(err, size){
    if(!err){
        console.log(size)
    }
})

// terminal 
get-files-size  ./src  -t js,css,html,json -u K -i /node_modules/ -c

// terminal path也可以通过 -p 传入，同时传入时，取选项 path 传入的值
get-files-size -p ./src  -t .js,.css,html,json -u K -i /node_modules/ -c
```

### Options
| 选项 | 说明 |
| --- | --- |
| -p[path] | 文件夹或文件路径 |
| -t[type] | 文件类型，取后缀，例如 css、js、png等，符号点[.]可省略 |
| -u[unit] | 文件大小单位，B K M G |
| -i[ignore] | 需要忽略的路径，例如 node_modules |
| -c[chalk] | 是否需要打印 |
