const URLS  = {
    LIST:'/business-service/workflow/team/task',
};

export default {
    /**
     * @param options
     *select:{"taskType":1,"pageNumber":0,"pageSize":10,"like":"","between":{"col":"createTime","range":[-28800000,1488297599999]}}
        taskType:1
     */
    LIST(options){
        return $http({
            url:URLS.LIST,
            data:options
        }).then(res => res);
    },
    GET(){

    },
}
