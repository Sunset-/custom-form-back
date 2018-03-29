import {TASK_STATUS} from '../config';
const URLS  = {
    LIST:'/manage-service/workflow/task',
    //疑难
    LIST_PERPLEX:'/manage-service/workflow/consultation/task',
};

export default {
    /**
     * *select:{"taskType":1,
     * "pageNumber":0,
     * "pageSize":10,
     * "like":"",
     * "between":
     * {"col":"createTime",
     * "range":[-28800000,1488297599999]}
     * }
        taskType:1
     */
    LIST(data,type){
        let url = URLS.LIST;
        if(type&&(type==TASK_STATUS.PERPLEX)){
            url = URLS.LIST_PERPLEX;
        }
        return $http({
            url,
            data
        });
    },
    GET(){
    },

}
