import service from '../utils/request.js'



/*条件查询AA*/
export function GetApi (companyId, badTypeName) {
    return service.request({
        method: "GET",
        url: "/BadType/Get",
        params: {
            companyId: companyId,
            badTypeName: badTypeName
        }
    })
}
/*新增*/
export function AddApi (companyId, badTypeName, remark) {
    return service.request({
        method: "GET",
        url: "/BadType/Add",
        params: {
            companyId: companyId,
            badTypeName: badTypeName,
            remark: remark
        }
    })
}
/*修改*/
export function EditApi (companyId, badTypeId, badTypeName, remark) {
    return service.request({
        method: "GET",
        url: "/BadType/Edit",
        params: {
            companyId: companyId,
            badTypeId: badTypeId,
            badTypeName: badTypeName,
            remark: remark
        }
    })
}
/*删除*/
export function DelApi (companyId, badTypeId) {
    return service.request({
        method: "GET",
        url: "/BadType/Del",
        params: {
            companyId: companyId,
            badTypeId: badTypeId
        }
    })
}