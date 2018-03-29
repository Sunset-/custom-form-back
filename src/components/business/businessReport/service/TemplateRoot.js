const URLS ={
    LIST:'/business-service/template/find_template_report_root',
};

export default {
    LIST(options){
        return $http({
            url:URLS.LIST,
        });
    }
}
