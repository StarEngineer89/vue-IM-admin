import { useLocalStorage, useSessionStorage } from '@vueuse/core'

export const isDark = useSessionStorage('isDark', false)

export const token = useSessionStorage('token', '')
export const userInfo = useSessionStorage('userInfo', {})
export const purview = useSessionStorage('purview', '')   //权限
export const role =  useSessionStorage('role', '')        //角色