const URLS = {
    SUBMIT_REPORT: '/manage-service/workflow/report/submit', //提交审核，自写自审
    REPLY_REPORT: '/manage-service/workflow/report', //提交会诊意见
    TO_REVIEW: '/manage-service/workflow/report/modify_review', // 写审
    GET: '/manage-service/workflow/apply_form',
    SAVE_FORWARD: '/manage-service/workflow/task/save_forward', //保存转发
    FORWARD: '/manage-service/workflow/task/forward', //转发
    REJECT: '/manage-service/workflow/report/review', //驳回
    HISTORY: '/manage-service/workflow/history', //历史报告，
    CONSULTATION: '/manage-service/workflow/consultation/apply',
    MARK_KNOTTY: '/manage-service/workflow/task/mark_doubt', //疑难
    MARK_HIGH_RISK: '/manage-service/workflow/task/update_property', //高危
    CLAIM_TASK: '/manage-service/workflow/task/claim', // 领取
    TASK_LOCK_REFRESH: '/manage-service/workflow/task/locker/refresh', //写报告锁
    LOG: '/manage-service/workflow/logs', //日志
    ENSURE_CANCEL: '/manage-service/workflow/task/cancel',//取消确认
    INVALID: 'service/workflow/report/invalid', //作废,
    ADD_CENTER:'/manage-service/workflow/task/collect/add',//收藏
    SAVE_CORRECTION: '/manage-service/workflow/form/update',//报告参数
    LOCK:'/manage-service/workflow/task/lock' //加锁
};
let CONSULTATION_SIMLE_DOCTOR = 2;

export default {
    /**
     * [type description]
     * options={
         workTaskId:this.TASKID,
         imagingFinding:this.formModel.show,
         imagingTips:this.formModel.tip,
         positiveNegative:this.formModel.positiveNegative,
         suggests:this.formModel.suggest,
         imageMark:'{}',
     };
     * @type {String}
     */
    WRITE(options) {
        var url = URLS.SUBMIT_REPORT;

        return $http({
            url,
            method: 'POST',
            data: JSON.stringify(options),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },
    REPLY_REPORT(options) {
        var url = URLS.REPLY_REPORT;

        return $http({
            url,
            method: 'POST',
            data: JSON.stringify(options),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },
    /**
     * 审核通过按钮
     * @type {String}
     * @options {Object}
     * {
     *  reportId:'',
        reviewerId:''
     * }
     *
     * {
     *    workTaskId:this.TASKID,
          imagingFinding:this.formModel.show,
          imagingTips:this.formModel.tip,
          positiveNegative:this.formModel.positiveNegative,
          suggests:this.formModel.suggest,
          imageMark:'{}',
          options.reviewerAccountId = this.USERID;
        }
     */
    REVIEW(options) {
        let url = URLS.TO_REVIEW;
        return $http({
            url,
            method: 'POST',
            data: JSON.stringify(options),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },
    /**
     *
     */
    GET(options) {
        let url = URLS.GET;
        return $http({
            url,
            data: options
        });
    },
    /**
     * 保存转发
     * options  = {
         taskId: this.TASKID,
         newProcessor: newProcessor
     };
     */
    SAVE_FORWARD(options) {
        let url = URLS.SAVE_FORWARD;
        return $http({
            url,
            data: options,
            method: 'POST'
        });
    },

    /**
     * 转发
     * // /service/workflow/task/forward
     // taskId:19740cd6b6e744be81db93ce77a872bb
     // newProcessor:71100b68a7714bec93d05ef313af1fbf
     */
    FORWARD(options) {
        let url = URLS.FORWARD;
        return $http({
            url,
            data: options,
            method: 'POST'
        });
    },
    /**
     * reportId: reportId,
		isPass: isPass,
		remark: remark
     */
    REJECT(options) {
        let url = URLS.REJECT;
        return $http({
            url,
            data: options,
            method: 'POST'
        });
    },

    /**
     * 
     * @param {*} options taskId 
     */
    HISTORY(options) {
        let url = URLS.HISTORY;
        return $http({
            url,
            data: options
        });
    },
    /**
     * options={
         taskId: taskId,
         doctorExpertIds: {
         [id]:2
     }
     },
     */
    CONSULTATION(options) {
        var url = URLS.CONSULTATION;

        return $http({
            url,
            method: 'POST',
            data: JSON.stringify(options),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },

    /**
     * taskId
     */
    MARK_KNOTTY(options) {
        return $http({
            url: URLS.MARK_KNOTTY,
            method: 'POST',
            data: options
        });
    },

    /**
     * 高危标记
     *{
     *  taskId:
     *  taskProperty:"32''
     *}
     */
    MARK_HIGH_RISK(options) {
        return $http({
            url: URLS.MARK_HIGH_RISK,
            method: 'POST',
            data: options
        });
    },


    //领取
    //taskId:''
    CLAIM_TASK(options) {
        return $http({
            url: URLS.CLAIM_TASK,
            method: 'POST',
            data: options
        });
    },

    //锁
    //taskid
    LOCK(options) {
        let url = URLS.TASK_LOCK_REFRESH;
        return $http({
            url,
            data: options,
        });
    },

    /**
     * 
     * @param {*} options taskId 
     */
    LOG(options) {
        let url = URLS.LOG;
        return $http({
            url,
            data: options
        });
    },

    /**
     * 确认取消
     * taskId
     */
    ENSURE_CANCEL(options) {
        let url = URLS.ENSURE_CANCEL;

        return $http({
            url,
            data: options,
            method: 'POST'
        });
    },

    /**
     * 确认取消
     * taskId
     */
   INVALID(options) {
        let url = URLS.INVALID;

        return $http({
            url,
            data: options,
            method: 'POST'
        });
    },

    /**
     * 添加收藏
     * taskId
     * collectType:'customer'
     * @param {*} options 
     */
    ADD_CENTER(options){
        let url = URLS.ADD_CENTER;
        return $http({
            url,
            data: options,
            method: 'POST'
        });
    },


    /**
     * 修正报告中的病人信息
     * @param {*} options 
     * 
     * id:"",
     * fixedField:"" string {}
     * 
     */
    CONSULTATION(options) {

        var url = URLS.SAVE_CORRECTION;

        return $http({
            url,
            method: 'POST',
            data: JSON.stringify(options),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },
    /**
     * 锁
     * @param {*taskId} options 
     * taskId
     */
    LOCK_NEW(options){
        var url = URLS.LOCK;

        return $http({
            url,
            method:'POST',
            data:options,
        });
    }
    
};