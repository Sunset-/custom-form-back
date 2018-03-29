const URLS ={
    LIST:'/business-service/template/find_template_report',
};

export default {
    LIST(options){
        return $http({
            url:URLS.LIST,
            data:options
        });
    }
}
