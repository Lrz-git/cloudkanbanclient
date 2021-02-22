import service from '../utils/request.js'

/*条件查询*/
export function GetGroupApi (companyId, groupName_like) {
    return service.request({
        method: "GET",
        url: "/Group/GetGroup",
        params: {
            companyId: companyId,
            groupName: groupName_like
        }
    })
}
/*详细的权限查询*/
export function GetDetailApi (groupId) {
    return service.request({
        method: "GET",
        url: "/Group/queryDetail",
        params: {
            groupId: groupId,
        }
    })
}
/*新增*/
export function AddGroupApi (companyId, userId, groupName, remark) {
    return service.request({
        method: "GET",
        url: "/Group/AddGroup",
        params: {
            companyId: companyId,
            userId: userId,
            groupName: groupName,
            remark: remark
        }
    })
}
/*修改*/
export function EditGroupApi (companyId, groupId, userId, groupName, remark) {
    return service.request({
        method: "GET",
        url: "/Group/EditGroup",
        params: {
            companyId: companyId,
            groupId: groupId,
            userId: userId,
            groupName: groupName,
            remark: remark
        }
    })
}
/*删除*/
export function DelGroupApi (groupId) {
    return service.request({
        method: "GET",
        url: "/Group/DelGroup",
        params: {
            groupId: groupId
        }
    })
}
/*修改操作权限*/
export function EditPowerApi (relationId, powerType) {
    return service.request({
        method: "GET",
        url: "/Group/EditPowerApi",
        params: {
            relationId: relationId,
            powerType: powerType
        }
    })
}