import axios from "axios";
import qs from 'qs';
import cookie from "../../assets/js/cookie";
import router from "../../router";
import Vue from 'vue'

var instance = axios.create({ //axios实例配置
    baseURL: process.env.VUE_APP_BASEURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
});



// http    拦截器
instance.interceptors.request.use(
    config => {
        if (config.method === 'post' && config.headers['Content-Type'] == 'application/x-www-form-urlencoded') { //post请求序列化
            config.data = qs.stringify(config.data);
        }
        let token = encodeURIComponent(cookie.get('_auth'));
        if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers._auth = token;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });
// http response 拦截器
instance.interceptors.response.use(
    response => {
        
        // console.log(response.data.data)
        if (response.data.errorCode) {
            Vue.prototype.$Message.error(response.data.errorMsg)
            
        }        
        //  if (!response.data.errorCode) {
        //     Vue.prototype.$Message.success(response.data.errorMsg||'操作成功')
        //  }
        // if (response.data.data.code) {
        //     Vue.prototype.$Message.error(response.data.data.error)
        //     return response;
        // }
        // if (response.data.data.retCode&&response.data.data.retCode != '000000') {
        //     Vue.prototype.$Message.error(response.data.data.retMsg)
        //
        //    console.log(response.data.data.retCode)
        // }
        // if (response.data.data.retCode == '000000') {
        //      Vue.prototype.$Message.success(response.data.data.retMsg)
        // }
        
        if (response.data.errorCode == -2) {
            cookie.clear()
            router.push('/login')
            return
        }
        //console.log(response.data.errorCode);
        
        return response;
    },
    error => {
        console.log(error.response)
        if (error.response) {
             if (error.response.data.code) {
                 Vue.prototype.$Message.error(error.response.data.error)
             }
            switch (error.response.status) {
                case 401:
                    // 401 清除token信息并跳转到登录页面
                    cookie.clear()
                    router.push({name:'login'})
            }

        }
        // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
        return Promise.reject(error.response.data) // 返回接口返回的错误信息
    });
export default instance
