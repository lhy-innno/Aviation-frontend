import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios'
import qs from 'qs'
axios.defaults.timeout = 600000
import { message, notification } from 'antd'

const config = {
	// 设置超时时间（10s）
	timeout: 10000,
	// 跨域时候允许携带凭证
	withCredentials: true
}
class RequestHttp {
	service: AxiosInstance
	public constructor(config: AxiosRequestConfig) {
		this.service = axios.create(config)
		this.service.interceptors.request.use(
			(config: any) => {
				// todo 添加token

				// 序列化get请求
				if (config.method === 'get') {
					config.paramsSerializer = (params: any) => {
						return qs.stringify(params, { arrayFormat: 'repeat' })
					}
				}
				return config
			},
			(error: any) => {
				return Promise.reject(error)
			}
		)
		this.service.interceptors.response.use(
			(response: AxiosResponse) => {
				const responseCode = response.status
				if (responseCode >= 200 && responseCode < 300) {
					return Promise.resolve(response)
				} else {
					return Promise.reject(response)
				}
			},
			(error: any) => {
				//todo 请求重试

				// 断网或者请求超时状态
				if (!error.response) {
					// 请求超时状态
					if (error.config.hideErrorMsg) {
						// 隐藏提示
					} else if (error.message.includes('timeout')) {
						// messageApi.open({
						//   type: 'error',
						//   content: '请求超时，请检查网络是否连接正常'
						// })
						notification.error({
							message: '请求超时，请检查网络是否连接正常'
						})
					} else if (error.message.includes('cancel')) {
						// 主动取消，不抛异常
					} else {
						notification.error({
							message: '请求失败，请检查网络是否已连接'
						})
					}
					return Promise.reject(error)
				}
				// todo token更新
				//  todo 统一错误码处理
			}
		)
	}

	/* 用途：
  1、请求成功，业务状态码200，对返回结果的解构（若不需要解构，用requireOriginalRes控制）
  2、http请求200， 业务状态码非200，说明逻辑判断这是不成功的，那就全局message提示服务端的报错
      因为并非所有 http错误状态码都配置有错误信息，所以通过 hasErrTips 控制
   */
	async request(config: AxiosRequestConfig, hasErrTips = false, requireOriginalRes = false) {
		try {
			const res = await this.service.request(config)
			if (res.status === 204) {
				//有缓存
				return Promise.resolve()
			}
			if (requireOriginalRes) {
				return Promise.resolve(res)
			}
			const { code, msg, data } = res.data //后端定义的统一返回体
			if (code === 200) {
				return Promise.resolve(data)
			} else {
				notification.error({
					message: msg
				})
				return Promise.reject(res.data)
			}
		} catch (e: any) {
			if (hasErrTips) {
				const errText = e.msg //需与后端统一
				notification.error({
					message: errText
				})
			}
			return Promise.reject(e)
		}
	}

	get(
		url: string,
		params?: any,
		config: any = {},
		hasErrTips?: boolean,
		requireOriginalRes?: boolean
	) {
		return this.request({ method: 'get', url, params, ...config }, hasErrTips, requireOriginalRes)
	}

	post(
		url: string,
		data?: any,
		config: any = {},
		hasErrTips?: boolean,
		requireOriginalRes?: boolean
	) {
		console.log(111)
		return this.request({ method: 'post', url, data, ...config }, hasErrTips, requireOriginalRes)
	}

	del(
		url: string,
		data?: any,
		config: any = {},
		hasErrTips?: boolean,
		requireOriginalRes?: boolean
	) {
		return this.request({ method: 'delete', url, data, ...config }, hasErrTips, requireOriginalRes)
	}

	put(
		url: string,
		data?: any,
		config: any = {},
		hasErrTips?: boolean,
		requireOriginalRes?: boolean
	) {
		return this.request({ method: 'get', url, data, ...config }, hasErrTips, requireOriginalRes)
	}
}

export default new RequestHttp(config)
