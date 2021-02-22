import service from '../utils/request.js'

/*查询用户 */
export function GetUserInfoApi (companyId) {
    return service.request({
        method: "GET",
        url: "/WorkShop/GetUser",
        params: {
            companyId: companyId
        }
    })
}
/*条件查询*/
export function GetWorkShopApi (companyId, workShopName) {
    return service.request({
        method: "GET",
        url: "/WorkShop/GetWorkShop",
        params: {
            companyId: companyId,
            workShopName: workShopName
        }
    })
}
/*新增*/
export function AddWorkShopApi (companyId, workShopName, userId) {
    return service.request({
        method: "GET",
        url: "/WorkShop/AddWorkShop",
        params: {
            companyId: companyId,
            workShopName: workShopName,
            userId: userId
        }
    })
}
/*修改*/
export function EditWorkShopApi (companyId, workShopName, userId, workShopId) {
    return service.request({
        method: "GET",
        url: "/WorkShop/EditWorkShop",
        params: {
            companyId: companyId,
            workShopName: workShopName,
            userId: userId,
            workShopId: workShopId
        }
    })
}
/*删除*/
export function DelWorkShopApi (workShopId) {
    return service.request({
        method: "GET",
        url: "/WorkShop/DelWorkShop",
        params: {
            workShopId: workShopId
        }
    })
}