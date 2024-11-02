import Header from '../common/header'
import Footer from '../common/footer-simple'
export default function LayoutSimple({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
