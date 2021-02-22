import service from '../utils/request.js'



/*查询所有下拉框*/
export function GetConditionApi (companyId) {
    return service.request({
        method: "GET",
        url: "/Plan/GetCondition",
        params: {
            companyId: companyId
        }
    })
}
/*查询*/
export function GetApi (companyId, lienId, shiftId, productId, orderNo) {
    return service.request({
        method: "GET",
        url: "/Plan/Get",
        params: {
            companyId: companyId,
            lienId: lienId,
            shiftId: shiftId,
            productId: productId,
            orderNo: orderNo
        }
    })
}
/*查询计划明细*/
export function GetDetailApi (companyId, planId) {
    return service.request({
        method: "GET",
        url: "/Plan/GetDetail",
        params: {
            companyId: companyId,
            planId: planId
        }
    })
}
/*查询班次的时间段*/
export function GetworkingTimeApi (companyId, shiftId) {
    return service.request({
        method: "GET",
        url: "/Plan/GetworkingTime",
        params: {
            companyId: companyId,
            shiftId: shiftId
        }
    })
}
/*新增*/
export function AddApi (companyId, orderNo, lineId, shiftId, productId, countPreceptId, detail) {
    return service.request({
        method: "POST",
        url: "/Plan/Add",
        params: {
            companyId: companyId,
            orderNo: orderNo,
            lineId: lineId,
            shiftId: shiftId,
            productId: productId,
            countPreceptId: countPreceptId,
            detail: detail
        }
    })
}
/*编辑时查询一次,很多编辑时要用到的ID在GetApi并没有查出来,为了GetApi 的速度,所以编辑时再查*/
export function GetEditApi (companyId, planId) {
    return service.request({
        method: "GET",
        url: "/Plan/GetEdit",
        params: {
            companyId: companyId,
            planId: planId
        }
    })
}
/*修改*/
export function EditApi (companyId, planId, orderNo, lineId, shiftId, productId, countPreceptId, detail) {
    return service.request({
        method: "POST",
        url: "/Plan/Edit",
        params: {
            companyId: companyId,
            planId: planId,
            orderNo: orderNo,
            lineId: lineId,
            shiftId: shiftId,
            productId: productId,
            countPreceptId: countPreceptId,
            detail: detail
        }
    })
}
/*删除*/
export function DelApi (id) {
    return service.request({
        method: "GET",
        url: "/Plan/Del",
        params: {
            id: id
        }
    })
}
/*编辑时删除明细*/
export function DelDetailApi (id) {
    return service.request({
        method: "GET",
        url: "/Plan/DelDetail",
        params: {
            id: id
        }
    })
}
/*下发*/
export function SendApi (companyId, planId, lineId) {
    return service.request({
        method: "GET",
        url: "/Plan/Send",
        params: {
            companyId: companyId,
            planId: planId,
            lineId: lineId
        }
    })
}

/*结束*/
export function EndApi (companyId, planId) {
    return service.request({
        method: "GET",
        url: "/Plan/End",
        params: {
            companyId: companyId,
            planId: planId
        }
    })
}