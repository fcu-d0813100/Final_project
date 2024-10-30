import 'bootstrap/dist/css/bootstrap.min.css'
import '@/styles/global.scss'
import { WorkshopCartProvider } from '@/components/hooks/use-cartW'
import { ProductCartProvider } from '@/components/hooks/use-cartP'

export default function MyApp({ Component, pageProps }) {
  // 使用自訂在頁面層級的版面(layout)
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <ProductCartProvider>
      <WorkshopCartProvider>
        {getLayout(<Component {...pageProps} />)}
      </WorkshopCartProvider>
    </ProductCartProvider>
  )
}
