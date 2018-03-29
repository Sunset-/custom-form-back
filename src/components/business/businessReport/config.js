//任务状态
export const TASK_STATUS = {
    PERPLEX: 3, //疑难
    FINISH: 2, //完成
    RUNNING: 1 //进行中
};

//任务类型是团队或个人
export const OWN_TYPE = {
    INDIVIDUAL: 1, //个人
    TEAM: 2 //团队
};

//报告状态
export const REPORT_STATUS = {
    WRITE_NEW: 1, //新写
    WRITE_RE: 2, //重写
    REVIEW_SUBMIT: 3, //代审
    REVIEW_PASS: 4, //审核通过
    REVIEW_FAIL: 5 //审核不通过
};
export const REPORT_STATUS_TEXT = {
    0: '未处理',
    1: '新写报告', //新写
    2: '重写', //重写
    3: '待审核', //代审
    4: '审核通过', //审核通过
    5: '驳回' //审核不通过
};

//任务状态
export const TASK_DETAIL_STATUS = {
    NEW: 1, //新生任务,
    TOBEASSIGNED: 2, //待分配
    PENDING: 3, //待处理
    PROCESSING: 4, //正在处理
    FINISHED: 5, //处理完成
    ARCHIVED: 6, //已归档
    BACK: 7, //已退回
    APPLY_CANCEL: 8, //申请取消
    CANCEL: 9, //已取消
};

//报告医生权限
export const OWNER_PRIVILEGE = {
    PRACTICE: 1,
    WRITE: 2,
    REVIEW: 3
};

//阴阳性
export const POSITIVE_NEGATIVE = {
    POSITIVE: 2,
    NEGATIVE: 3
}

//会诊权限
export const CONSULTATION_MEMBER = {
    SUBMITER: 1,
    WRITER: 2,
    REVIEWR: 4,
};

//任务类型加急疑难会诊
export const TASK_TYPE = {
    URGENT: 0,
    KNOTTY: 0,
    CONSULTATION: 16,
}

//退回原因
export const BACK_REASON = {
    '1': '因图像质量原因被退回。',
    '2': '因患者信息描述太少被退回。',
    '3': '患者信息与图像不符被退回。',
    '4': '因检查部位与图像显示不符被退回。'
}

//
// //报告状态
// const REPORT_STATUS = {
//     NEW_WRITE: {
//         value: 1,
//         text: '新写报告',
//         opcText: '未完成',
//     },
//     RE_WRITE: {
//         value: 2,
//         text: '重写',
//         opcText: '未完成',
//     },
//     SUBMIT_REVIEW: {
//         value: 3,
//         text: '待审核',
//         opcText: '未完成',
//     },
//     REVIEW_PASS: {
//         value: 4,
//         text: '审核通过',
//         opcText: '已完成',
//     },
//     REVIEW_FAIL: {
//         value: 5,
//         text: '驳回',
//         opcText: '未完成',
//     }
// };
//工作流程任务状态
const REPORT_TASK_STATUS = {
    NEW: {
        value: 1,
        text: '新生任务',
        opcText: '处理中'
    },
    TOBEASSIGNED: {
        value: 2,
        text: '待分配',
        opcText: '处理中'
    },
    PENDING: {
        value: 3,
        text: '待处理',
        opcText: '处理中'
    },
    PROCESSING: {
        value: 4,
        text: '正在处理',
        opcText: '处理中'
    },
    FINISHED: {
        value: 5,
        text: '处理完成',
        opcText: '已完成'
    },
    ARCHIVED: {
        value: 6,
        text: '已归档',
        opcText: '已归档'
    },
    BACK: {
        value: 7,
        text: '已退回',
        opcText: '已退回'
    },
    APPLY_CANCEL: {
        value: 8,
        text: '申请取消',
        opcText: '已申请取消'
    },
    CANCEL: {
        value: 9,
        text: '已取消',
        opcText: '已取消'
    }
};

export let REPORT_TASK_STATUS_ENUM = {};
for (var key in REPORT_TASK_STATUS) {
    REPORT_TASK_STATUS_ENUM[key] = REPORT_TASK_STATUS[key].value;
}


window.SERVER_OPTIONS = {
    /**
     * include 为空则为所有，否则仅为include内的，
     * except 除了什么之外，include 范围内
     * reportUrl 为对应大云连接含端口号
     */
    QrReport: {
        show: true,
        include: null, //['']
        except: null, //['']
        reportUrl: 'www.peaimage.com',
        port: ""
    }
};


window.SERVER_OPTIONS.QR = function (opcId) {
    let options = window.SERVER_OPTIONS.QrReport;

    let QrHandle = {};

    QrHandle.url = options.reportUrl + options.port ? `:${options.port}` : '';

    QrHandle.show = options.show;


    if (!opcId) {
        return QrHandle;
    }
    
    if (include) {

    } else {

    }

    if (except) {
        if (except.indexOf(opcId)) {

        }
    } else {

    }


};