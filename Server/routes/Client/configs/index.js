export const PORT = 3000
export const DEV = true

// express 的位置
export const apiBaseUrl = 'http://localhost:3005/api'
export const avatarBaseUrl = 'http://localhost:3005/avatar'

// breadcrumb面包屑使用
// 用pathname英文對照中文的名稱(類似關聯陣列的物件)
// 使用方式需用 ex. pathnameLocale['home']
// 下面是防止自動格式化使用註解
/* eslint-disable */
// prettier-ignore
export const pathsLocaleMap = {
  'cart':'購物車',
  'forget-password':'重設密碼',
  'register':'註冊',
  'login':'登入',
  'member':'會員',
  'about': '關於我們',
  'product': '產品',
  'breadcrumb':'麵包屑',
  'home':'首頁',
  'posts':'張貼文章',
  'user':'會員',
}
/* eslint-enable */
