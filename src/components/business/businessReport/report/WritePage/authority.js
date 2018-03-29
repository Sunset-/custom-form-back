/**
 * 权限管理
 */

/**
 *
 // 提交会诊意见
 CONSULTATION_REPORT
 //会诊
 CONSULTATION
 // 驳回
 REJECT
 // 审核
 REVIEW

 //转发
 FORWARD

 //提交审核
 SUBMIT

 //自审自写
 REPLY_REVIEW

 */

/**
 * 作废
 */
let Is_Abandon = {
    // 提交会诊意见
    CONSULTATION_REPORT: true,
    //会诊
    CONSULTATION: true,
    // 驳回
    REJECT: false,
    // 审核
    REVIEW: true,

    //转发
    FORWARD: true,

    //提交审核
    SUBMIT: true,

    //自审自写
    REPLY_REVIEW: true
};

let Is_Not_Owner ={
    // 提交会诊意见
    CONSULTATION_REPORT: false,
    //会诊
    CONSULTATION: false,
    // 驳回
    REJECT: false,
    // 审核
    REVIEW: false,

    //转发
    FORWARD: false,

    //提交审核
    SUBMIT: false,

    //自审自写
    REPLY_REVIEW: false
};
//双签
let Is_Double_Sign = {
    // 提交会诊意见
    CONSULTATION_REPORT: true,
    //会诊
    CONSULTATION: true,
    // 驳回
    REJECT: true,
    // 审核
    REVIEW: true,

    //转发
    FORWARD: true,

    //提交审核
    SUBMIT: true,

    //自审自写
    REPLY_REVIEW: false
};

//团队
let Is_Not_Team = {
    // 提交会诊意见
    CONSULTATION_REPORT: false,
    //会诊
    CONSULTATION: false,
    // 驳回
    REJECT: false,
    // 审核
    REVIEW: false,
    //转发
    FORWARD: false,
    //提交审核
    SUBMIT: false,
    //自审自写
    REPLY_REVIEW: true
};

//不是会诊状态
let Is_Not_Consultation  = {
    // 提交会诊意见
    CONSULTATION_REPORT: false,
    //会诊
    CONSULTATION: true,
    // 驳回
    REJECT: true,
    // 审核
    REVIEW: true,
    //转发
    FORWARD: true,
    //提交审核
    SUBMIT: true,
    //自审自写
    REPLY_REVIEW: true
};

//不是会诊状态
let Is_Consultation  = {
    // 提交会诊意见
    CONSULTATION_REPORT: true,
    //会诊
    CONSULTATION: false,
    // 驳回
    REJECT: true,
    // 审核
    REVIEW: true,
    //转发
    FORWARD: false,
    //提交审核
    SUBMIT: true,
    //自审自写
    REPLY_REVIEW: false
};

//会诊写人
let Is_ConSultation_Writer = {
    // 提交会诊意见
    CONSULTATION_REPORT: true,
    //会诊
    CONSULTATION: false,
    // 驳回
    REJECT: false,
    // 审核
    REVIEW: true,
    //转发
    FORWARD: true,
    //提交审核
    SUBMIT: false,
    //自审自写
    REPLY_REVIEW: true
};
//会诊提交人
let Is_ConSultation_Submiter = {
    // 提交会诊意见
    CONSULTATION_REPORT: false,
    //会诊
    CONSULTATION: true,
    // 驳回
    REJECT: true,
    // 审核
    REVIEW: true,
    //转发
    FORWARD: true,
    //提交审核
    SUBMIT: true,
    //自审自写
    REPLY_REVIEW: true
};
//会诊审核人
let Is_ConSultation_Reviewer = {
    // 提交会诊意见
    CONSULTATION_REPORT: true,
    //会诊
    CONSULTATION: true,
    // 驳回
    REJECT: true,
    // 审核
    REVIEW: true,
    //转发
    FORWARD: true,
    //提交审核
    SUBMIT: true,
    //自审自写
    REPLY_REVIEW: true
};



//用户权限 {1,2,3} 实习， 写，审
let Own_Privilege = {

    1: {
        // 提交会诊意见
        CONSULTATION_REPORT: true,
        //会诊
        CONSULTATION: true,
        // 驳回
        REJECT: false,
        // 审核
        REVIEW: false,
        //转发
        FORWARD: true,
        //提交审核
        SUBMIT: false,
        //自审自写
        REPLY_REVIEW: false
    },
    2: {
        // 提交会诊意见
        CONSULTATION_REPORT: true,
        //会诊
        CONSULTATION: true,
        // 驳回
        REJECT: false,
        // 审核
        REVIEW: false,
        //转发
        FORWARD: true,
        //提交审核
        SUBMIT: true,
        //自审自写
        REPLY_REVIEW: false
    },
    3: {
        // 提交会诊意见
        CONSULTATION_REPORT: true,
        //会诊
        CONSULTATION: true,
        // 驳回
        REJECT: true,
        // 审核
        REVIEW: true,
        //转发
        FORWARD: true,
        //提交审核
        SUBMIT: true,
        //自审自写
        REPLY_REVIEW: true
    }
}


//报告状态 {1,2,3,4,5}
/**
 * [Report_Status description]
 * @type {Object}
 * 0:无报告
 * 1:新写报告,
 * 2:重写',
 * 3:待审核,
 * 4:审核通过,
 * 5:驳回
 */
let Report_Status = {
    0:{
        // 提交会诊意见
        CONSULTATION_REPORT: true,
        //会诊
        CONSULTATION: true,
        // 驳回
        REJECT: false,
        // 审核
        REVIEW: false,
        //转发
        FORWARD: true,
        //提交审核
        SUBMIT: true,
        //自审自写
        REPLY_REVIEW: true
    },
    1: {
        // 提交会诊意见
        CONSULTATION_REPORT: true,
        //会诊
        CONSULTATION: true,
        // 驳回
        REJECT: false,
        // 审核
        REVIEW: false,
        //转发
        FORWARD: true,
        //提交审核
        SUBMIT: true,
        //自审自写
        REPLY_REVIEW: true
    },
    2: {
        // 提交会诊意见
        CONSULTATION_REPORT: true,
        //会诊
        CONSULTATION: true,
        // 驳回
        REJECT: true,
        // 审核
        REVIEW: false,
        //转发
        FORWARD: true,
        //提交审核
        SUBMIT: true,
        //自审自写
        REPLY_REVIEW: true
    },
    3: {
        // 提交会诊意见
        CONSULTATION_REPORT: false,
        //会诊
        CONSULTATION: false,
        // 驳回
        REJECT: true,
        // 审核
        REVIEW: true,
        //转发
        FORWARD: true,
        //提交审核
        SUBMIT: false,
        //自审自写
        REPLY_REVIEW: false
    },
    4: {
        // 提交会诊意见
        CONSULTATION_REPORT: false,
        //会诊
        CONSULTATION: false,
        // 驳回
        REJECT: false,
        // 审核
        REVIEW: false,
        //转发
        FORWARD:false,
        //提交审核
        SUBMIT: false,
        //自审自写
        REPLY_REVIEW: false
    },
    5: {

        // 提交会诊意见
        CONSULTATION_REPORT: true,
        //会诊
        CONSULTATION: true,
        // 驳回
        REJECT: false,
        // 审核
        REVIEW: false,
        //转发
        FORWARD: true,
        //提交审核
        SUBMIT: true,
        //自审自写
        REPLY_REVIEW: true
    },

}

//任务状态 {1-9}
/**
 * 1:新生任务，
 * 2:待分配，
 * 3:待处理，
 * 4:正在处理，
 * 5:处理完成
 * 6:归档
 * 7:退回
 * 8:申请取消
 * 9:已取消
 */
let Task_Status ={
    1:{
        // 提交会诊意见
        CONSULTATION_REPORT: false,
        //会诊
        CONSULTATION: false,
        // 驳回
        REJECT: false,
        // 审核
        REVIEW: false,
        //转发
        FORWARD: true,
        //提交审核
        SUBMIT: true,
        //自审自写
        REPLY_REVIEW: true
    },2:{
        // 提交会诊意见
        CONSULTATION_REPORT: false,
        //会诊
        CONSULTATION: false,
        // 驳回
        REJECT: false,
        // 审核
        REVIEW: false,
        //转发
        FORWARD: false,
        //提交审核
        SUBMIT: false,
        //自审自写
        REPLY_REVIEW: false,
    },3:{
        // 提交会诊意见
        CONSULTATION_REPORT: false,
        //会诊
        CONSULTATION: true,
        // 驳回
        REJECT: false,
        // 审核
        REVIEW: false,
        //转发
        FORWARD: true,
        //提交审核
        SUBMIT: true,
        //自审自写
        REPLY_REVIEW: true,
    },4:{
        // 提交会诊意见
        CONSULTATION_REPORT: true,
        //会诊
        CONSULTATION: true,
        // 驳回
        REJECT: true,
        // 审核
        REVIEW: true,
        //转发
        FORWARD: true,
        //提交审核
        SUBMIT: true,
        //自审自写
        REPLY_REVIEW: true,
    },5:{
        // 提交会诊意见
        CONSULTATION_REPORT: false,
        //会诊
        CONSULTATION: false,
        // 驳回
        REJECT: false,
        // 审核
        REVIEW: false,
        //转发
        FORWARD: false,
        //提交审核
        SUBMIT: false,
        //自审自写
        REPLY_REVIEW: false,
    },6:{
        // 提交会诊意见
        CONSULTATION_REPORT: false,
        //会诊
        CONSULTATION: false,
        // 驳回
        REJECT: false,
        // 审核
        REVIEW: false,
        //转发
        FORWARD: false,
        //提交审核
        SUBMIT: false,
        //自审自写
        REPLY_REVIEW: false
    },7:{
        // 提交会诊意见
        CONSULTATION_REPORT: false,
        //会诊
        CONSULTATION: false,
        // 驳回
        REJECT: false,
        // 审核
        REVIEW: false,
        //转发
        FORWARD: false,
        //提交审核
        SUBMIT: false,
        //自审自写
        REPLY_REVIEW: false
    },8:{
        // 提交会诊意见
        CONSULTATION_REPORT: false,
        //会诊
        CONSULTATION: false,
        // 驳回
        REJECT: false,
        // 审核
        REVIEW: false,
        //转发
        FORWARD: false,
        //提交审核
        SUBMIT: false,
        //自审自写
        REPLY_REVIEW: false
    },9:{
        // 提交会诊意见
        CONSULTATION_REPORT: false,
        //会诊
        CONSULTATION: false,
        // 驳回
        REJECT: false,
        // 审核
        REVIEW: false,
        //转发
        FORWARD: false,
        //提交审核
        SUBMIT: false,
        //自审自写
        REPLY_REVIEW: false
    }
};



export default {
    Is_Not_Owner,
    Is_Double_Sign,
    Is_Not_Team,
    Is_Abandon,
    Own_Privilege,
    Report_Status,
    Task_Status,
    Is_Not_Consultation,
    Is_Consultation,
    Is_ConSultation_Writer,
    Is_ConSultation_Submiter,
    Is_ConSultation_Reviewer
};
