import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

const BASE_URL = 'https://web-ban-dien-thoai-production.up.railway.app'

const getImageUrl = (path) => {
  if (!path) return ''
  const cleanPath = path.replace(/^\/?image\//, '')
  return `${BASE_URL}/image/${cleanPath}`
}

function SearchResults() {
  const [searchParams] = useSearchParams()
  const tuKhoa = searchParams.get('q') || ''
  const navigate = useNavigate()
  const [ketQua, setKetQua] = useState([])
  const [loading, setLoading] = useState(true)
  const [loi, setLoi] = useState('')

  useEffect(() => {
    if (!tuKhoa) return
    setLoading(true)
    api.get(`/api/products?search=${encodeURIComponent(tuKhoa)}`)
      .then(res => {
        setKetQua(res.data.data || [])
        setLoading(false)
      })
      .catch(() => {
        setLoi('Không thể tìm kiếm!')
        setLoading(false)
      })
  }, [tuKhoa])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
        🔍 Kết quả tìm kiếm: <span className="text-orange-500">"{tuKhoa}"</span>
      </h2>
      <p className="text-gray-500 mb-6">Tìm thấy {ketQua.length} sản phẩm</p>

      {loading && <p className="text-gray-500">Đang tìm kiếm...</p>}
      {loi && <p className="text-red-500">{loi}</p>}

      {!loading && ketQua.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">😔</p>
          <p className="text-lg mb-6">Không tìm thấy sản phẩm nào!</p>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition font-semibold"
          >
            Về trang chủ
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {ketQua.map(sp => (
          <div key={sp.product_id} className="bg-white rounded-xl shadow hover:shadow-lg transition border border-gray-100">
            <img
              src={getImageUrl(sp.main_image)}
              alt={sp.product_name}
              onClick={() => navigate(`/products/${sp.product_id}`)}
              className="w-full h-36 md:h-48 object-contain p-3 md:p-4 cursor-pointer"
            />
            <div className="p-3 md:p-4">
              <h3 className="font-semibold text-gray-800 mb-1 text-sm md:text-base line-clamp-2">
                {sp.product_name}
              </h3>
              <p className="text-orange-500 font-bold mb-3 text-sm md:text-base">
                {Number(sp.min_sale_price).toLocaleString('vi-VN')} đ
              </p>
              <button
                onClick={() => navigate(`/products/${sp.product_id}`)}
                className="w-full bg-orange-500 text-white py-1.5 md:py-2 rounded-lg hover:bg-orange-600 transition font-semibold text-sm"
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SearchResults