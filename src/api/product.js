import service from '../utils/request.js'



/*条件查询*/
export function GetProApi (companyId, productName, productModel) {
    return service.request({
        method: "GET",
        url: "/Product/GetPro",
        params: {
            companyId: companyId,
            productName: productName,
            productModel: productModel
        }
    })
}
/*新增*/
export function AddProApi (companyId, productName, productModel, remark) {
    return service.request({
        method: "GET",
        url: "/Product/AddPro",
        params: {
            companyId: companyId,
            productName: productName,
            productModel: productModel,
            remark: remark
        }
    })
}
/*修改*/
export function EditProApi (companyId, productId, productName, productModel, remark) {
    return service.request({
        method: "GET",
        url: "/Product/EditPro",
        params: {
            companyId: companyId,
            productId: productId,
            productName: productName,
            productModel: productModel,
            remark: remark
        }
    })
}
/*删除*/
export function DelProApi (companyId, productId) {
    return service.request({
        method: "GET",
        url: "/Product/DelPro",
        params: {
            companyId: companyId,
            productId: productId
        }
    })
}