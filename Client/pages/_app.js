import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import DefaultLayout from '@/components/layout/pages/layout-default'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/styles/global.scss'
import { WorkshopCartProvider } from '@/hooks/use-cartW'
import { ProductCartProvider } from '@/hooks/use-cartP'
import { AuthProvider } from '@/hooks/use-auth'
import toast, { Toaster } from 'react-hot-toast'

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)  // 用來阻止渲染頁面

  useEffect(() => {
    const hasVisitedLanding = localStorage.getItem('hasVisitedLanding')

    // 如果標記不存在，則設置標記並跳轉到 /landing
    if (!hasVisitedLanding) {
      localStorage.setItem('hasVisitedLanding', 'true')
      router.push('/landing')
    } else {
      // 如果標記已存在，直接顯示頁面內容
      setLoading(false)
    }

    // 監聽頁面關閉事件，關閉頁面時清除標記
    const handleBeforeUnload = () => {
      localStorage.removeItem('hasVisitedLanding')
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    // 清理 event listener
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [router])

  // 如果正在加載，則不渲染任何內容，防止顯示閃爍的首頁
  if (loading) {
    return null
  }

  // 使用自訂在頁面層級的版面(layout)
  const getLayout =
    Component.getLayout || ((page) => <DefaultLayout>{page}</DefaultLayout>)

  return (
    <AuthProvider>
      <ProductCartProvider>
        <WorkshopCartProvider>
          {getLayout(<Component {...pageProps} />)}
          <Toaster position="top-center" reverseOrder={false} />
        </WorkshopCartProvider>
      </ProductCartProvider>
    </AuthProvider>
  )
}
