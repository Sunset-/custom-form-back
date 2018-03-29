
const URLS ={
    // LIST:'/service/template/find_template_report',
    GET:'/manage-service/workflow/detail',
    RETURN_SENDER:'/manage-service/workflow/task/back',
};

export default {
    /**
     * @param options ={
     *          canWrite:true
     *          taskId:68b91f3c518442bfa46d309523ce5c93
     *        }
     */
    GET(options){
        return $http({
            url:URLS.GET,
            data:options
        });
    },

    RETURN_SENDER(options){
        let url = URLS.RETURN_SENDER;
        return $http({
            url,
            data:options,
            method:'POST'
        });
    }
}
