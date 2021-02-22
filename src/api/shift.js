import service from '../utils/request.js'



/*查询班次*/
export function GetShiftApi (companyId) {
    return service.request({
        method: "GET",
        url: "/Shift/GetShift",
        params: {
            companyId: companyId
        }
    })
}
/*查询班次下的时间段*/
export function GetTimeApi (companyId, shiftId) {
    return service.request({
        method: "GET",
        url: "/Shift/GetTime",
        params: {
            companyId: companyId,
            shiftId: shiftId
        }
    })
}
/*新增*/
export function AddApi (companyId, shiftName, time) {
    return service.request({
        method: "POST",
        url: "/Shift/Add",
        params: {
            companyId: companyId,
            shiftName: shiftName,
            time: time
        }
    })
}
/*修改*/
export function EditApi (companyId, shiftId, shiftName, time) {
    return service.request({
        method: "POST",
        url: "/Shift/Edit",
        params: {
            companyId: companyId,
            shiftId: shiftId,
            shiftName: shiftName,
            time: time
        }
    })
}
/*删除*/
export function DelApi (companyId, shiftId) {
    return service.request({
        method: "GET",
        url: "/Shift/Del",
        params: {
            companyId: companyId,
            shiftId: shiftId
        }
    })
}
/*删除某一个时间段*/
export function DelWorkTimeApi (workingTimeId) {
    return service.request({
        method: "GET",
        url: "/Shift/DelWorkTime",
        params: {
            workingTimeId: workingTimeId
        }
    })
}