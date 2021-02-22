import service from '../utils/request.js'

/*权限组列表查询*/
export function GetGroupApi (companyId) {
    return service.request({
        method: "GET",
        url: "/User/GetGroup",
        params: {
            companyId: companyId
        }
    })
}
/*条件查询*/
export function GetUserApi (companyId, groupId, userName) {
    return service.request({
        method: "GET",
        url: "/User/GetUser",
        params: {
            companyId: companyId,
            groupId: groupId,
            userName: userName
        }
    })
}
/*新增*/
export function AddUserApi (companyId, groupId, userName, userPhone, userJob, userAvatar, userEmail) {
    return service.request({
        method: "GET",
        url: "/User/AddUser",
        params: {
            companyId: companyId,
            groupId: groupId,
            userName: userName,
            userPhone: userPhone,
            userJob: userJob,
            userAvatar: userAvatar,
            userEmail: userEmail
        }
    })
}
/*修改*/
export function EditUserApi (userId, companyId, groupId, userName, userPhone, userJob, userAvatar, userEmail) {
    return service.request({
        method: "GET",
        url: "/User/EditUser",
        params: {
            userId: userId,
            companyId: companyId,
            groupId: groupId,
            userName: userName,
            userPhone: userPhone,
            userJob: userJob,
            userAvatar: userAvatar,
            userEmail: userEmail
        }
    })
}
/*删除*/
export function DelUserApi (userId) {
    return service.request({
        method: "GET",
        url: "/User/DelUser",
        params: {
            userId: userId
        }
    })
}
/*重置密码*/
export function EditPassWordApi (userId, passWord) {
    return service.request({
        method: "GET",
        url: "/User/EditPassWord",
        params: {
            userId: userId,
            newPassWord: passWord
        }
    })
}
/*修改密码*/
export function EditNewPassWordApi (userId, oldPassWord, newPassWord) {
    return service.request({
        method: "GET",
        url: "/User/EditNewPassWord",
        params: {
            userId: userId,
            oldPassWord: oldPassWord,
            newPassWord: newPassWord
        }
    })
}