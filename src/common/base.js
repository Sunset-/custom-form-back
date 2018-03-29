;
import Vue from 'vue';

var Base = window.Base = {};

//业务钩子
Base.hooks = {};

//系统基础类
Base.transcode = function (type, value) {
    return Base.ENUM_MAP && Base.ENUM_MAP[type] && Base.ENUM_MAP[type][value] || value;
}
Base.dictionary = function (type) {
    return Base.ENUMS && Base.ENUMS[type] || [];
}

//业务基础类
Base.transformNfsFilePath = function (id) {
    return '/upload/api/1.0.0/file/acquisition/' + id;
};
Base.transformDicomThumbnail = function (id) {
    return '/business-service/fileRes/dcmPicture?listId=' + id;
};
Base.transformDicomThumbnailPeaimage = function (id) {
    return `http://www.peaimage.com${Base.transformDicomThumbnail(id)}`;
};
Base.transformCateyesUrl = function (id) {
    return '/cateyes/cateyes.html?studyIds=' + id;
};
Base.transformCateyesUrlPhone = function (id) {
    return '/cateyes/cateyes-phone.html?studyIds=' + id;
};
Base.transformCateyesUrlPeaimage = function (id) {
    return `http://www.peaimage.com${Base.transformCateyesUrl(id)}`;
};
Base.transformCateyesUrlPhonePeaimage = function (id) {
    return `http://www.peaimage.com${Base.transformCateyesUrlPhone(id)}`;
};
Base.openCateyes = function (id, isLocalImage, hidePatientInfo) {
    return window.open(`/cateyes/cateyes.html?studyIds=${id}&which=business-service&show=${hidePatientInfo?'false':'true'}`);
}
const DEFAULT_IMAGE = {
    DEFAULT: '/assets/img/icon-img.png',
    TEAM: '/assets/img/team-error.png',
    DOCTOR: '/assets/img/default.png',
    USER: '/assets/img/user-default.png'
}
Base.defaultImage = function (type) {
    return DEFAULT_IMAGE[type] || DEFAULT_IMAGE.DEFAULT;
}


/**
 * 业务DICOM缩略图路径转换
 */
Vue.filter('dicom-thumbnail', function (value) {
    return Base.transformDicomThumbnail(value);
});

/**
 * 业务NFS文件路径转换
 */
Vue.filter('upload-image', function (value) {
    return Base.transformNfsFilePath(value);
});

/**
 * 报告副标题
 */
Vue.filter('DeviceSubTitle', function (type) {
    if (type == 'CT') {
        return 'CT检查报告单';
    } else if (type == 'MR') {
        return '核磁检查报告单';
    } else {
        return '放射检查报告单';
    }
});

/**
 * 分享链接生成
 */
Base.Share = {};
//QQ分享
Base.Share.QQ = function (options) {
    var pics = '';
    if (options.pics && Array.isArray(options.pics)) {
        pics = options.pics[0];
    } else if (options.pics) {
        pics = options.pics;
    }
    let config = {
        url: options.url,
        desc: '',
        title: options.title || '',
        summary: options.summary || '',
        pics: pics,
        falsh: '',
        site: 'QQ',
        style: '201',
        width: 32,
        height: 32
    };
    let c = [];
    for (let k in config) {
        c.push(k + '=' + encodeURIComponent(config[k]));
    }
    return 'http://connect.qq.com/widget/shareqq/index.html?' + c.join('&');
}
//微博分享
Base.Share.Sina = function (options) {
    var pics = '';
    if (options.pics && Array.isArray(options.pics)) {
        for (var i = 0, len = options.pics.length; i < len; i++) {
            if (i > 0) {
                pics += '||';
            }
            pics += options.pics[i];
        }
    }
    const config = {
        url: options.url,
        title: options.title || '',
        summary: options.summary || '',
        pic: pics,
        language: 'zh_cn',
        searchPic: 'true',
        style: 'number'
    };
    let c = [];
    for (let k in config) {
        c.push(k + '=' + encodeURIComponent(config[k]));
    }
    return 'http://service.weibo.com/share/share.php?' + c.join('&');
}
//微信分享
Base.Share.Wechat = function (options) {
    return jrQrcode.getQrBase64(options.url);
}


module.exports = Base;