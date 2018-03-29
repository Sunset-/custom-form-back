const URLS = {
    LIST:'/business-service/team/member/list/teaminfo/',
    SELECT_MEMBER_TEAM:'/business-service/team/member/list/',
};

export default {
    LIST(options){
        return $http({
            url:URLS.LIST,
            data:options
        });
    },

    /**
     * options ={
     *  id:teamID,
     *  weakPrivilege:3
     * }
     */
    SELECT_MEMBER_TEAM(options){
        return $http({
            url:`${URLS.SELECT_MEMBER_TEAM}${options.id}`,
            data:options
        });
    }
}
