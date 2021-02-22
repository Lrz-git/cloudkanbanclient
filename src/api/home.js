import service from '../utils/request.js'
//引入axios
import axios from 'axios';

/*查询更新日志*/
export function GetUpdateInfoApi () {
    return service.request({
        method: "GET",
        url: "/updateInfo/GetUpdateInfo"
    })
}
/*查询轮播图和版本号等基础参数*/
export function GetBaseParamApi (companyId) {
    return service.request({
        method: "GET",
        url: "/Home/GetBaseParam",
        params: {
            companyId: companyId
        }
    })
}
//查询sunpn天气
export function GetSunpnWeather(){
    return axios.request({
        method:"GET",
        url:"https://www.sunpn-kf.com:2021/api/Sunpn/Weather"
    })
}

