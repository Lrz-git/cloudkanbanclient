//引入axios
import axios from 'axios'

const BASEURL = '/devApi';
//创建axios,赋给变量service
const service = axios.create({
    baseURL: 'https://www.sunpn-cloud.com:8886/api',//BASEURL,
    timeout: 5000
});

// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // console.log(config);
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});
// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // console.log(response);
    // 对响应数据做点什么
    return response;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});
//暴露
export default service;
/**
 * 使用export default不需要花括号,但是只能一次export
 * 没有使用default 可以多次export
 */