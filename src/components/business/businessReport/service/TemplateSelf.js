const URLS ={
    LIST:'/business-service/template/find_template_report_self',
    SAVE: '/business-service/template/add_update_template_report_self',
	DELETE: '/business-service/template/del_template_report_self'
};

export default {
    LIST(options){
        return $http({
            url:URLS.LIST,
            data:options
        });
    },
    /**
     * options = {
     * }
     */
    SAVE(options){
        let url = URLS.SAVE;

        return $http({
            url,
            method:'POST',
            data:{
                record: JSON.stringify(options)
            }
        });
    },
    /**
     * options ={
     *  id:''
     * }
     */
    DELETE(options){
        let url = URLS.DELETE;
        return $http({
            url,
            method:'POST',
            data:options
        })
    }
}
