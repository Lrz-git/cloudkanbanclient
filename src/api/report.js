import service from '../utils/request.js'



/*查询所有下拉框*/
export function GetConditionApi (companyId) {
    return service.request({
        method: "GET",
        url: "/Report/GetCondition",
        params: {
            companyId: companyId
        }
    })
}
/*查询*/
export function GetApi (companyId, lienId, shiftId, productId, orderNo, startDate, endDate) {
    return service.request({
        method: "GET",
        url: "/Report/Get",
        params: {
            companyId: companyId,
            lienId: lienId,
            shiftId: shiftId,
            productId: productId,
            orderNo: orderNo,
            startDate: startDate,
            endDate: endDate
        }
    })
}
/*查询计划明细*/
export function GetDetailApi (companyId, planId) {
    return service.request({
        method: "GET",
        url: "/Report/GetDetail",
        params: {
            companyId: companyId,
            planId: planId
        }
    })
}
