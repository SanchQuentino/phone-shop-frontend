import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import ManageProducts from './pages/admin/ManageProducts'
import Navbar from './components/Navbar'
import NotFound from './pages/NotFound'
import SearchResults from './pages/SearchResults'
import AddProduct from './pages/admin/AddProduct'
import Payment from './pages/Payment'
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin" element={<ManageProducts />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/admin/products/add" element={<AddProduct />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/payment/:orderId" element={<Payment />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App