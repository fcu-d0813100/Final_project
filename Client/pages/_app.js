import DefaultLayout from '@/components/layout/pages/layout-default'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/styles/global.scss'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { WorkshopCartProvider } from '@/hooks/use-cartW'
import { ProductCartProvider } from '@/hooks/use-cartP'
import { AuthProvider } from '@/hooks/use-auth'
import { ModalProvider } from '@/hooks/use-modal'
import toast, { Toaster } from 'react-hot-toast'

export default function MyApp({ Component, pageProps }) {

  const router = useRouter()
  const [loading, setLoading] = useState(true)  // 用來阻止渲染頁面

  useEffect(() => {
    const hasVisitedLanding = localStorage.getItem('hasVisitedLanding')

    // 當前頁面是首頁並且未訪問過 landing 頁面時跳轉
    if (router.pathname === '/' && !hasVisitedLanding) {
      localStorage.setItem('hasVisitedLanding', 'true')
      router.push('/landing')
    } else {
      // 如果標記已存在，顯示頁面內容
      setLoading(false)
    }

    // 清理標記和監聽器
    const handleBeforeUnload = () => {
      localStorage.removeItem('hasVisitedLanding')
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [router.pathname])

  // 如果正在加載，則不渲染任何內容，防止閃爍的首頁
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
          <ModalProvider>
            {getLayout(<Component {...pageProps} />)}
            <Toaster position="top-center" reverseOrder={false} />
          </ModalProvider>
        </WorkshopCartProvider>
      </ProductCartProvider>
    </AuthProvider>
  )
}
