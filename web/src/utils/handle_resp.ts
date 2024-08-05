import { Resp } from "../types/resp"

export const handleResp = <T>(
  resp: Resp<T>,
  success?: (data: T) => void,
  fail?: (message: string, code: number) => void,
  auth: boolean = true,
  notify_error: boolean = true,
  notify_success?: boolean
) => {
  if (resp.code === 0) {
    // notify_success && notify.success(resp.message)
    notify_success
    success?.(resp.data) // 可选链式调用，如果存在success回调函数，则调用处理
  } else {
    // notify_error && notify.error(resp.message)
    notify_error 
    if (auth && resp.code === 401) {
      // bus.emit(
      //   "to",
      //   `/@login?redirect=${encodeURIComponent(location.pathname)}`
      // )
      // return
    }
    fail?.(resp.message, resp.code)
  }
}

export const handleRespWithoutAuth = <T>(
  resp: Resp<T>,
  success?: (data: T) => void,
  fail?: (message: string, code?: number) => void,
  notify_error: boolean = true
) => {
  return handleResp(resp, success, fail, false, notify_error)
}

export const handleRespWithoutNotify = <T>(
  resp: Resp<T>,
  success?: (data: T) => void,
  fail?: (message: string, code?: number) => void,
  auth: boolean = true
) => {
  return handleResp(resp, success, fail, auth, false)
}

export const handleRespWithoutAuthAndNotify = <T>(
  resp: Resp<T>,
  success?: (data: T) => void,
  fail?: (message: string, code?: number) => void
) => {
  return handleResp(resp, success, fail, false, false)
}

export const handleRespWithNotifySuccess = <T>(
  resp: Resp<T>,
  success?: (data: T) => void,
  fail?: (message: string, code?: number) => void,
  auth: boolean = true,
  notify_error: boolean = true
) => {
  return handleResp(resp, success, fail, auth, notify_error, true)
}
