import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import bannerImg from '../assets/banner.jpg'
function Home() {
  const navigate = useNavigate()
  const [sanPham, setSanPham] = useState([])
  const [loading, setLoading] = useState(true)
  const [loi, setLoi] = useState('')
  const getImageUrl = (path) => {
      if (!path) return '';
      if (path.startsWith('http://') || path.startsWith('https://')) {
          return path;
      }
      const cleanPath = path.replace(/^\/?image\//, '');
      return `https://web-ban-dien-thoai-production.up.railway.app/image/${cleanPath}`;
  };
  useEffect(() => {
    api.get('/api/products')
      .then(res => {
        setSanPham(res.data.data)
        setLoading(false)
      })
      .catch(err => {
        setLoi('Không thể tải sản phẩm!')
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Đang tải...</p>
  if (loi) return <p style={{ color: 'red' }}>{loi}</p>

return (
  <div>
    <div
      className="relative text-white py-16 md:py-24 px-8 text-center"
      style={{
        backgroundImage: `url(${bannerImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="relative z-10">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">PhoneStore</h1>
        <p className="text-lg md:text-xl mb-2">Điện thoại chính hãng — Giá tốt, trả góp 0%</p>
        <p className="text-gray-200 mb-8 text-sm md:text-base">Giao hàng toàn quốc • Bảo hành 12 tháng • Đổi trả 30 ngày</p>
        <button
          onClick={() => document.getElementById('san-pham').scrollIntoView({ behavior: 'smooth' })}
          className="bg-orange-500 text-white px-6 md:px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition text-lg"
        >
          Mua ngay →
        </button>
      </div>
    </div>

    {/* Danh sách sản phẩm */}
    <div id="san-pham" className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Sản phẩm nổi bật</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {sanPham.map(sp => (
          <div key={sp.product_id} className="bg-white rounded-xl shadow hover:shadow-lg transition border border-gray-100">
            <img
              src={getImageUrl(sp.main_image)}
              alt={sp.product_name}
              onClick={() => navigate(`/products/${sp.product_id}`)}
              className="w-full h-36 md:h-48 object-contain p-3 md:p-4 cursor-pointer"
            />
            <div className="p-3 md:p-4">
              <h3 className="font-semibold text-gray-800 mb-1 text-sm md:text-base line-clamp-2">{sp.product_name}</h3>
              <p className="text-orange-500 font-bold mb-3 text-sm md:text-base">
                {Number(sp.min_sale_price).toLocaleString('vi-VN')} đ
              </p>
              <button
                onClick={() => navigate(`/products/${sp.product_id}`)}
                className="w-full bg-orange-500 text-white py-1.5 md:py-2 rounded-lg hover:bg-orange-600 transition font-semibold text-sm md:text-base"
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)
}

export default Home