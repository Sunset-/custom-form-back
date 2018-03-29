import {
    getAttribute,
    dataAdapter
} from '../util';

import {
    OWN_TYPE,
    CONSULTATION_MEMBER
} from '../config';

let patient = {};
let task = {
    is_urgent: false,
    is_knotty: false,
    is_high_risk: false,
    is_consultation: false,
    is_abandon: false,
};
let customer = {};
let report = {};


let dictionery = {
    patient: (baseData) => {
        if (baseData && baseData.applyForm && baseData.applyForm.fixedField) {

            let fixedField = baseData.applyForm.fixedField;
            fixedField = JSON.parse(fixedField);

            let check = JSON.parse(baseData.applyForm.checkPoint);
            let checkPoint = [];
            check.forEach(item => {
                checkPoint.push(item.label);
            });

            let _dictionary = {
                name: 'applyForm.fixedField.patientName',
                sex: 'applyForm.fixedField.patientSex',
                age: 'applyForm.fixedField.patientAge',
                No: 'applyForm.fixedField.patientNo',
                ICard: 'applyForm.fixedField.patientIdNumber',
                deviceType: 'applyForm.fixedField.type',
                base_deviceType:'baseInfo.deviceType',
                imageNo: 'applyForm.fixedField.studyNo',
                bedNo: 'applyForm.fixedField.bedNo',
                hospictalNo: 'applyForm.fixedField.inHospitalNo',
                office: 'applyForm.fixedField.applyOffice',
                base_office: 'applyForm.applyOffice',
                imageId: 'applyForm.imageId',
                check_describe: 'applyForm.describe',
                check_method: 'applyForm.checkMethod',
                check_hospictal: 'applyForm.customer.description',
                check_time: 'baseInfo.patientCheckDate',
                check_imgs: "applyForm.accessories"
            };

            dataAdapter(_dictionary, patient, baseData, ['applyForm.fixedField']);
            checkPoint.points = checkPoint.join(',');
            checkPoint.pointCount = checkPoint.length;
            (typeof patient.office !== 'string') && (patient.office = patient.base_office || '');
            (typeof patient.deviceType !== 'string') && (patient.deviceType = patient.base_deviceType || '');
            
            
            patient.check_points = getAttribute(checkPoint, 'points');
            patient.check_count = getAttribute(checkPoint, 'pointCount') || 0;
        }
        return patient;
    },

    report: (baseData) => {

        if (baseData) {
            let _dictionary = {
                have: 'hasReport',
                write_name: 'currentReport.writer.designation',
                review_name: 'currentReport.reviewer.designation',
                review_time: 'currentReport.reviewTime',
                id: 'currentReport.id',
                reject_message: 'currentReport.remark',
                status: 'currentReport.reportStatus',
                consultations: 'memberReport'
            };
            dataAdapter(_dictionary, report, baseData);

            report.consultations = report.consultations || [];
            report.report_status = report.report_status || 0;

        }
        return report;
    },

    task: (baseData, options) => {
        if (baseData && baseData.task) {
            let _dictionary = {
                status: 'task.taskStatus',
                own_type: 'expert.expertType',
                report_status: 'currentReport.reportStatus',
                report_status_customer: 'report.reportStatusByCustomer',
                owner: 'owner',
                owner_id: 'task.ownerAccountId',
                id: 'task.taskId',
                property: 'task.taskProperty',
                is_double_sign: 'task.isDoubleSign',
                owner_privilege: 'task.ownerPrivilege',
                consultation_type: 'currentMember.doctorType',
                report_status_customer: 'currentReport.reportStatusByCustomer',
                current_member: 'currentMember',
                user_is_admin: 'user_is_admin',
                apply_time: 'applyTime',
                collect: 'hasCustomerCollect',
                apply_form_id: 'applyForm.id'
            };
            dataAdapter(_dictionary, task, baseData);

            task.is_consultation = !!(task.property & 16);
            task.is_team = !!(task.own_type == OWN_TYPE.TEAM);
            task.is_consultation_submiter = !!(task.consultation_type & CONSULTATION_MEMBER.SUBMITER);
            task.is_consultation_writer = !!(task.consultation_type & CONSULTATION_MEMBER.WRITER);
            task.is_consultation_reviewer = !!(task.consultation_type & CONSULTATION_MEMBER.REVIEWER);

            task.is_owner = !!(task.is_consultation && task.current_member) || !!(task.owner_id == options.UserId)
            task.is_urgent = !!(task.property & 2);
            task.is_knotty = !!(task.property & 4);
            task.is_high_risk = !!(task.property & 32);
            task.is_abandon = !!(task.report_status_customer);

            task.report_status = task.report_status || 0;

            task.finished = !!(report.status == 4);
            task.can_editor = (task.is_owner && report.status != 4);
        }
        return task;
    },
    customer: (baseData) => {
        if (baseData) {
            let _dictionary = {
                hospital_name: 'customer.designation',
                apply_name: 'applicant.designation',
                apply_phone: 'applicant.phone'
            };
            dataAdapter(_dictionary, customer, baseData);
        }
        return customer;
    },
};
export default dictionery;