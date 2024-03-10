package util

import "unsafe"

// See:https://github.com/go-eagle/eagle.git
// --------- 字节切片和字符串转换 ----------
// 性能很高, 原因在于底层无新的内存申请与拷贝

// BytesToString 字节切片转字符串
func BytesToString(b []byte) string {
	return *(*string)(unsafe.Pointer(&b))
}

// StringToBytes convert string to byte
func StringToBytes(s string) []byte {
	x := (*[2]uintptr)(unsafe.Pointer(&s))
	h := [3]uintptr{x[0], x[1], x[1]}
	return *(*[]byte)(unsafe.Pointer(&h))
}
