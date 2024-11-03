import Header from '../common/header'
import Footer from '../common/footer-global'
export default function LayoutDefault({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
