//系统管理
import Account from './components/system/account/Account.vue';
import SystemVariable from './components/system/systemVariable/SystemVariable.vue';
import Menu from './components/system/menu/Menu.vue';
import Permission from './components/system/permission/Permission.vue';

// 应用系统
import ApplicationSystem from 'business/applicationSystem/ApplicationSystem';
import FunctionCard from 'business/functionCard/FunctionCard';
import CustomForm from 'business/customForm/CustomForm';
import Dictionary from './components/business/dictionary/Dictionary.vue';
import Collector from './components/business/collector/Collector.vue';

//业务
// import Doctor from './components/business/doctor/Doctor.vue';
// import Hospital from './components/business/hospital/Hospital.vue';
// import Team from './components/business/team/Team.vue';
// import Customer from './components/business/customer/Customer.vue';
// import Template from './components/business/template/Template.vue';

// import Reporting from './components/business/reportCenter/Reporting.vue';
// import Reported from './components/business/reportCenter/Reported.vue';

// import DicomImage from './components/business/dicomImage/DicomImage.vue';
// import Dailycase from './components/business/dailycase/Dailycase.vue';

// import PlatformStatistics from './components/business/reportStatistics/PlatformStatistics.vue';
// import TeamStatistics from './components/business/reportStatistics/TeamStatistics.vue';
// import CustomerStatistics from './components/business/reportStatistics/CustomerStatistics.vue';

// import RelCustomer from './components/business/relCustomer/RelCustomer.vue';
// import TeamStatement from './components/business/statement/TeamStatement';

// import ConsultExpert from './components/business/consultExpert/ConsultExpert.vue';
// import ConsultProcess from './components/business/consultProcess/ConsultProcess.vue';

let permissions = {
    VIEW: '查看',
    ADD: '新增',
    MODIFY: '修改',
    DELETE: '删除',
    SWITCH: '开关',
    RESET_PASSWORD: '重置密码',
    ENUM_UPDATE: '枚举修改',
    ENUM_DELETE: '枚举删除',
    ENUM_ORDER: '枚举排序',
    ROLE: '分配角色',
    ENUM: '枚举管理',
    MOUNT_MENU: '挂载菜单',
    AUTHORIZATION: '授权',
    ADDREL: '添加关联关系',
    DELETEREL: '删除关联关系',
    REL_CUSTOMER: '关联站点',
    VIEW_MESSAGE: '查看消息'
};

let modules = [
    //系统模块
    {
        group: '系统模块',
        name: 'Account',
        title: '管理账户',
        permission: ['ADD', 'MODIFY', 'DELETE', 'RESET_PASSWORD', 'ROLE'],
        component: Account
    }, {
        group: '系统模块',
        name: 'Dictionary',
        title: '字典管理',
        permission: ['ADD', 'MODIFY', 'DELETE', 'ENUM', 'ENUM_UPDATE', 'ENUM_DELETE', 'ENUM_ORDER'],
        component: Dictionary
    }, {
        group: '系统模块',
        name: 'SystemVariable',
        title: '系统变量',
        permission: ['ADD', 'MODIFY', 'DELETE'],
        component: SystemVariable
    }, {
        group: '系统模块',
        name: 'Menu',
        title: '菜单配置',
        permission: ['ADD', 'MODIFY', 'DELETE', 'MOUNT_MENU'],
        component: Menu
    }, {
        group: '系统模块',
        name: 'Permission',
        title: '权限管理',
        permission: ['ADD', 'MODIFY', 'DELETE', 'AUTHORIZATION'],
        component: Permission
    },
    //应用系统
    {
        group: '应用系统',
        color: 'info',
        name: 'ApplicationSystem',
        title: '应用系统',
        permission: ['ADD', 'MODIFY', 'DELETE'],
        component: ApplicationSystem
    }, {
        group: '应用系统',
        color: 'info',
        name: 'FunctionCard',
        title: '功能卡片',
        permission: ['ADD', 'MODIFY', 'DELETE'],
        component: FunctionCard
    }, {
        group: '应用系统',
        color: 'info',
        name: 'CustomForm',
        title: '自定义表单',
        permission: ['ADD', 'MODIFY', 'DELETE'],
        component: CustomForm
    }, {
        group: '应用系统',
        color: 'info',
        name: 'Collector',
        title: '采集器',
        permission: ['ADD', 'MODIFY', 'DELETE'],
        component: Collector
    },
    //业务模块
    // {
    //     group: '业务模块',
    //     color: 'warning',
    //     name: 'Doctor',
    //     title: '医生管理',
    //     permission: ['ADD', 'MODIFY'],
    //     component: Doctor
    // }, {
    //     group: '业务模块',
    //     color: 'warning',
    //     name: 'Hospital',
    //     title: '医院管理',
    //     permission: ['ADD', 'MODIFY', 'DELETE'],
    //     component: Hospital
    // }, {
    //     group: '业务模块',
    //     color: 'warning',
    //     name: 'Team',
    //     title: '团队管理',
    //     permission: ['ADD', 'MODIFY'],
    //     component: Team
    // }, {
    //     group: '业务模块',
    //     color: 'warning',
    //     name: 'Customer',
    //     title: '站点管理',
    //     permission: ['ADD', 'MODIFY', 'ADDREL', 'DELETEREL'],
    //     component: Customer
    // }, {
    //     group: '业务模块',
    //     color: 'warning',
    //     name: 'Template',
    //     title: '诊断模板',
    //     permission: ['ADD', 'MODIFY', 'DELETE'],
    //     component: Template
    // }, {
    //     group: '业务模块',
    //     color: 'warning',
    //     name: 'DicomImage',
    //     title: 'Dicom影像',
    //     permission: ['ADD', 'MODIFY', 'DELETE'],
    //     component: DicomImage
    // }, {
    //     group: '业务模块',
    //     color: 'warning',
    //     name: 'Dailycase',
    //     title: '每日一例',
    //     permission: ['ADD', 'MODIFY', 'DELETE'],
    //     component: Dailycase
    // }, {
    //     group: '业务模块',
    //     color: 'warning',
    //     name: 'Reporting',
    //     title: '诊断中心',
    //     permission: ['VIEW', 'DELETE'],
    //     component: Reporting
    // }, {
    //     group: '业务模块',
    //     color: 'warning',
    //     name: 'Reported',
    //     title: '归档报告',
    //     permission: ['VIEW', 'DELETE'],
    //     component: Reported
    // }, {
    //     group: '业务模块',
    //     color: 'warning',
    //     name: 'RelCustomer',
    //     title: '用户关联站点',
    //     permission: ['REL_CUSTOMER'],
    //     component: RelCustomer
    // }, {
    //     group: '统计模块',
    //     color: 'success',
    //     name: 'PlatformStatistics',
    //     title: '平台统计',
    //     permission: [],
    //     component: PlatformStatistics
    // }, {
    //     group: '统计模块',
    //     color: 'success',
    //     name: 'TeamStatistics',
    //     title: '团队统计',
    //     permission: [],
    //     component: TeamStatistics
    // }, {
    //     group: '统计模块',
    //     color: 'success',
    //     name: 'CustomerStatistics',
    //     title: '医院申请数',
    //     permission: [],
    //     component: CustomerStatistics
    // }, {
    //     group: '统计模块',
    //     color: 'success',
    //     name: 'TeamStatement',
    //     title: '团队对账单',
    //     permission: [],
    //     component: TeamStatement
    // }, {
    //     group: '业务模块',
    //     color: 'warning',
    //     name: 'ConsultExpert',
    //     title: '咨询专家',
    //     permission: ['ADD', 'MODIFY', 'SWITCH'],
    //     component: ConsultExpert
    // }, {
    //     group: '业务模块',
    //     color: 'warning',
    //     name: 'ConsultProcess',
    //     title: '咨询流程',
    //     permission: ['VIEW_MESSAGE'],
    //     component: ConsultProcess
    // }
];

var moduleComponent = {};
modules.forEach(m => {
    moduleComponent[m.name] = m.component;
});

module.exports = {
    moduleComponent: moduleComponent,
    modules: modules,
    permissions: permissions
};