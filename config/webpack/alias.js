var alias = {
    'jquery': 'jquery/dist/jquery.min.js',
    'font-awesome': 'font-awesome/css/font-awesome.min.css',
    'echarts' : 'echarts',
    'ueditor': '../src/vendor/ueditor/ueditor.sunset.js',
    'ueditor-config': '../src/vendor/ueditor/ueditor.config.js',
    'ztree': '../src/vendor/ztree/zTreeStyle/zTreeStyle.css',
    'ztree-style': '../src/vendor/ztree/jquery.ztree.all-3.5.min.js',
    'iview': 'iview/dist/iview.min.js',
    'iview-style' : 'iview/dist/styles/iview.css',
    'business' : '../src/components/business'
};

const path = require('path');
const NODE_MODULES_DIR = path.join(__dirname, '../../node_modules');

module.exports = function (config) {
    //resolve
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    //noParse
    config.module = config.module || {};
    config.module.noParse = config.module.noParse || [];
    for (var k in alias) {
        if (alias.hasOwnProperty(k)) {
            var depPath = path.resolve(NODE_MODULES_DIR, alias[k]);
            config.resolve.alias[k] = depPath;
            config.module.noParse.push(depPath);
        }
    }
    return config;
}