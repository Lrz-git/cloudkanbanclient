import service from '../utils/request.js'

/*图片上传*/
export function AvatarUploadApi (companyId, userId, files) {
    return service.request({
        method: "POST",
        headers: {
            'Content-Type': 'multipart/form-data'  //进行文件上传时，就需要使用该格式
        },
        url: "/Tool/AvatarUpload",
        params: {
            companyId: companyId,
            userId: userId
        },
        formData: files
    })
}
