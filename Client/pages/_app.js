import 'bootstrap/dist/css/bootstrap.min.css'
import '@/styles/global.scss'
import '@fortawesome/fontawesome-free/css/all.min.css';
export default function MyApp({ Component, pageProps }) {
  // 使用自訂在頁面層級的版面(layout)
  const getLayout = Component.getLayout || ((page) => page)

  return getLayout(<Component {...pageProps} />)
}
