import service from '../utils/request.js'
//引入axios
import axios from 'axios';
/*** 登录 */
export function LoginApi (userPhone, passWrod) {
    return service.request({
        method: "GET",
        url: "/User/Login",
        params: {
            phone: userPhone,
            passWord: passWrod
        }
        // ?phone=" + userPhone + "&passWord=" + passWrod
    })
}
/**请求菜单 */
export function MenuApi (userId) {
    return service.request({
        method: "GET",
        url: "/User/GetMenu",
        params: {
            userId: userId
        }
    })
}

//获取验证码
export function SendCaptchaApi(TelNo){
    return axios.request({
        method:"POST",
        url:"https://www.sunpn-kf.com:2021/api/Sunpn/SendCaptcha",
        params:{
            TelNo:TelNo
        }
    })
}