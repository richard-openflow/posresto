// @flow
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

//const BASE_URL = "http://192.168.1.21:9900/manager.openflow.pro"
const BASE_URL = "https://api.openflow.pro/manager.openflow.pro"

function baseAxios(options) {

    let defaultHeaders = {
        'Content-Type': 'application/json',
    }

    const service = axios.create({
        baseURL: BASE_URL,
        timeout: options.timeout || 30000,
        headers: defaultHeaders,
    })

    service.interceptors.request.use(
        async config => {
            let token = await AsyncStorage.getItem("token");

            if (token)
                config.headers["Authorization"] = "bearer " + token
            return config
        }
    )

    return service
}


function executeRequest(method, pathname, data, options = {}) {

    const body = method === 'get' || !data ? {} : { data }
    const reqObj = { method, url: pathname, params: options.query, ...body }

    const baseAxiosRequest = baseAxios(options)
    return new Promise((resolve, reject) => {
        return baseAxiosRequest
            .request(reqObj)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                reject(error)

            })
    })
}

const API = {
    get(pathname, options) {
        return executeRequest('get', pathname, null, options)
    },

    post(pathname, data, options) {
        return executeRequest('post', pathname, data, options)
    },

    put(pathname, data, options) {
        return executeRequest('put', pathname, data, options)
    },

    delete(pathname, data, options) {
        return executeRequest('delete', pathname, data, options)
    },

    all(promises) {
        return axios.all(promises)
    },
}


export {
    API
}
