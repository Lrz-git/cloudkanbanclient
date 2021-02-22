import service from '../utils/request.js'


/*查询用户和车间 */
export function GetUserAndWorkShopApi (companyId) {
    return service.request({
        method: "GET",
        url: "/Line/GetUserAndWorkShop",
        params: {
            companyId: companyId
        }
    })
}
/*条件查询*/
export function GetLineInfoApi (companyId, lineName, workShopId, userId) {
    return service.request({
        method: "GET",
        url: "/Line/GetLine",
        params: {
            companyId: companyId,
            lineName: lineName,
            workShopId: workShopId,
            userId: userId
        }
    })
}
/*新增*/
export function AddLineApi (workShopId, lineName, userId, lineMac, population) {
    return service.request({
        method: "GET",
        url: "/Line/AddLine",
        params: {
            workShopId: workShopId,
            lineName: lineName,
            userId: userId,
            lineMac: lineMac,
            population: population
        }
    })
}
/*修改*/
export function EditLineApi (lineId, workShopId, lineName, userId, lineMac, population, actualPopulation) {
    return service.request({
        method: "GET",
        url: "/Line/EditLine",
        params: {
            lineId: lineId,
            workShopId: workShopId,
            lineName: lineName,
            userId: userId,
            lineMac: lineMac,
            population: population,
            actualPopulation: actualPopulation
        }
    })
}
/*删除*/
export function DelLineApi (companyId, lineId) {
    return service.request({
        method: "GET",
        url: "/Line/DelLine",
        params: {
            companyId: companyId,
            lineId: lineId
        }
    })
}