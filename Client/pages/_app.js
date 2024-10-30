import 'bootstrap/dist/css/bootstrap.min.css'
import '@/styles/global.scss'
import { CartProvider } from '@/components/hooks/use-cart'
import { CartWorkshopProvider } from '@/components/hooks/use-cartW'

export default function MyApp({ Component, pageProps }) {
  // 使用自訂在頁面層級的版面(layout)
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <CartProvider>
      <CartWorkshopProvider>
        {getLayout(<Component {...pageProps} />)}
      </CartWorkshopProvider>
    </CartProvider>
  )
}
