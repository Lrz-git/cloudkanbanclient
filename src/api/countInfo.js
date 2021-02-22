import service from '../utils/request.js'



/*条件查询*/
export function GetApi (companyId, countPreceptName) {
    return service.request({
        method: "GET",
        url: "/CountPrecept/GetCount",
        params: {
            companyId: companyId,
            countPreceptName: countPreceptName
        }
    })
}
/*新增*/
export function AddApi (companyId, countPreceptName, stepSize, stepSizeBad, intervalTime, delayTime, remark) {
    return service.request({
        method: "GET",
        url: "/CountPrecept/AddCount",
        params: {
            companyId: companyId,
            countPreceptName: countPreceptName,
            stepSize: stepSize,
            stepSizeBad: stepSizeBad,
            intervalTime: intervalTime,
            delayTime: delayTime,
            remark: remark
        }
    })
}
/*修改*/
export function EditApi (companyId, countPreceptId, countPreceptName, stepSize, stepSizeBad, intervalTime, delayTime, remark) {
    return service.request({
        method: "GET",
        url: "/CountPrecept/EditCount",
        params: {
            companyId: companyId,
            countPreceptId: countPreceptId,
            countPreceptName: countPreceptName,
            stepSize: stepSize,
            stepSizeBad: stepSizeBad,
            intervalTime: intervalTime,
            delayTime: delayTime,
            remark: remark
        }
    })
}
/*删除*/
export function DelApi (companyId, countPreceptId) {
    return service.request({
        method: "GET",
        url: "/CountPrecept/DelCount",
        params: {
            companyId: companyId,
            countPreceptId: countPreceptId
        }
    })
}