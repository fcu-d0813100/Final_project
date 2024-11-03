import DefaultLayout from '@/components/layout/pages/layout-default'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/styles/global.scss'
import { WorkshopCartProvider } from '@/hooks/use-cartW'
import { ProductCartProvider } from '@/hooks/use-cartP'

export default function MyApp({ Component, pageProps }) {
  // 使用自訂在頁面層級的版面(layout)
  const getLayout =
    Component.getLayout || ((page) => <DefaultLayout>{page}</DefaultLayout>)

  return (
    <ProductCartProvider>
      <WorkshopCartProvider>
        {getLayout(<Component {...pageProps} />)}
      </WorkshopCartProvider>
    </ProductCartProvider>
  )
}
