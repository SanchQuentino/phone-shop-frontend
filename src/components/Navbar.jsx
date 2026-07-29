import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [tuKhoa, setTuKhoa] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (!tuKhoa.trim()) return
    navigate(`/search?q=${encodeURIComponent(tuKhoa.trim())}`)
    setTuKhoa('')
    setMenuOpen(false)
  }

  const handleLogout = async () => {
    await api.post('/api/auth/logout')
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const goTo = (path) => {
    navigate(path)
    setMenuOpen(false)
  }

  return (
    <nav className="bg-orange-500 text-white px-4 md:px-6 py-3 shadow-md">
      <div className="flex items-center justify-between gap-4">

        {/* Logo — bên trái */}
        <div
          className="text-lg md:text-xl font-bold cursor-pointer flex-shrink-0"
          onClick={() => goTo('/')}
        >
          PhoneStore
        </div>

        {/* Phần bên phải — Search + Menu */}
        <div className="flex items-center gap-4">
          
          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden md:flex">
            <input
              type="text"
              value={tuKhoa}
              onChange={e => setTuKhoa(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-64 px-4 py-1.5 rounded-l-full text-gray-800 bg-white focus:outline-none text-sm placeholder-gray-400"
            />
            <button
              type="submit"
              className="bg-orange-700 px-3 py-1.5 rounded-r-full hover:bg-orange-800 transition text-sm"
            >
              🔍
            </button>
          </form>

          {/* Menu desktop */}
          <div className="hidden md:flex gap-4 items-center">
            <span onClick={() => goTo('/cart')} className="cursor-pointer hover:text-orange-200 transition text-sm">Giỏ hàng</span>
            <span onClick={() => goTo('/orders')} className="cursor-pointer hover:text-orange-200 transition text-sm">Đơn hàng</span>
            {user ? (
  <>
    {/* Tên tài khoản — click vào admin thì vào manage products */}
    <span
      onClick={() => (user.role === 'Admin' || user.role_id === 1) ? goTo('/admin') : null}
      className={`font-semibold text-sm ${
        (user.role === 'Admin' || user.role_id === 1)
          ? 'cursor-pointer hover:text-yellow-300 transition'
          : 'cursor-default'
      }`}
      title={(user.role === 'Admin' || user.role_id === 1) ? 'Vào trang quản trị' : ''}
    >
      {(user.role === 'Admin' || user.role_id === 1) ? '⚙️' : '👤'} {user.fullName || user.username}
    </span>
    <span
      onClick={handleLogout}
      className="cursor-pointer bg-white text-orange-500 px-3 py-1 rounded-full font-semibold hover:bg-orange-100 transition text-sm"
    >
      Đăng xuất
    </span>
      </>
    ) : (
      <>
        <span onClick={() => goTo('/login')} className="cursor-pointer bg-white text-orange-500 px-3 py-1 rounded-full font-semibold hover:bg-orange-100 transition text-sm">Đăng nhập</span>
        <span onClick={() => goTo('/register')} className="cursor-pointer hover:text-orange-200 transition text-sm">Đăng ký</span>
      </>
    )}
          </div>

          {/* Hamburger mobile */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Search bar mobile */}
      <form onSubmit={handleSearch} className="md:hidden flex mt-3">
        <input
          type="text"
          value={tuKhoa}
          onChange={e => setTuKhoa(e.target.value)}
          placeholder="Tìm kiếm sản phẩm..."
          className="flex-1 px-4 py-2 rounded-l-full text-gray-800 bg-white focus:outline-none text-sm placeholder-gray-400"
        />
        <button type="submit" className="bg-orange-700 px-3 py-2 rounded-r-full hover:bg-orange-800 transition">
          🔍
        </button>
      </form>

      {/* Menu mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-3 mt-3 pb-2 border-t border-orange-400 pt-3">
          <span onClick={() => goTo('/')} className="cursor-pointer hover:text-orange-200">Trang chủ</span>
          <span onClick={() => goTo('/cart')} className="cursor-pointer hover:text-orange-200">Giỏ hàng</span>
          <span onClick={() => goTo('/orders')} className="cursor-pointer hover:text-orange-200">Đơn hàng</span>
          {user ? (
            <>
              <span className="font-semibold">👤 {user.fullName || user.username}</span>
              <span onClick={handleLogout} className="cursor-pointer bg-white text-orange-500 px-4 py-2 rounded-lg font-semibold text-center">Đăng xuất</span>
            </>
          ) : (
            <>
              <span onClick={() => goTo('/login')} className="cursor-pointer bg-white text-orange-500 px-4 py-2 rounded-lg font-semibold text-center">Đăng nhập</span>
              <span onClick={() => goTo('/register')} className="cursor-pointer hover:text-orange-200">Đăng ký</span>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar