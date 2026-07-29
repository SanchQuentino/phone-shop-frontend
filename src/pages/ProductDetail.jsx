import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

const getImageUrl = (path) => {
    if (!path) return '';

    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    const cleanPath = path.replace(/^\/?image\//, '');

    return `https://web-ban-dien-thoai-production.up.railway.app/image/${cleanPath}`;
};

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [sanPham, setSanPham] = useState(null)
  const [anhHienThi, setAnhHienThi] = useState(null)
  const [storageChon, setStorageChon] = useState('')
  const [mauChon, setMauChon] = useState(null)

  useEffect(() => {
    api.get(`/api/products/${id}`)
      .then(res => {
        const data = res.data.data
        setSanPham(data)
        setAnhHienThi(data.images[0]?.image)
        // Mặc định chọn dung lượng đầu tiên
        const storageDefault = data.variants[0]?.storage_name
        setStorageChon(storageDefault)
        // Mặc định chọn màu đầu tiên của dung lượng đó
        const mauDefault = data.variants.find(v => v.storage_name === storageDefault)
        setMauChon(mauDefault)
      })
      .catch(err => console.log(err))
  }, [id])

  if (!sanPham) return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-gray-500 text-lg">Đang tải...</p>
    </div>
  )

  // Lấy danh sách dung lượng không trùng
  const dungLuongs = [...new Set(sanPham.variants.map(v => v.storage_name))]

  // Lấy danh sách màu theo dung lượng đang chọn
  const mauTheoStorage = sanPham.variants.filter(v => v.storage_name === storageChon)

  // Xử lý chọn dung lượng
  const handleChonStorage = (storage) => {
    setStorageChon(storage)
    const mauMoi = sanPham.variants.find(v => v.storage_name === storage)
    setMauChon(mauMoi)
  }

  // Thêm vào giỏ hàng
  const themVaoGio = async () => {
    if (!mauChon) return
    try {
      await api.post('/api/cart/member/add', {
        variant_id: mauChon.variant_id,
        quantity: 1
      })
      alert('Đã thêm vào giỏ hàng!')
    } catch (err) {
      if (err.response?.status === 401) {
        alert('Vui lòng đăng nhập trước!')
        navigate('/login')
      } else {
        alert('Không thể thêm vào giỏ hàng!')
      }
    }
  }

  // Mua ngay — thêm giỏ rồi chuyển đến giỏ hàng
  const muaNgay = async () => {
    if (!mauChon) return
    try {
      await api.post('/api/cart/member/add', {
        variant_id: mauChon.variant_id,
        quantity: 1
      })
      navigate('/cart')
    } catch (err) {
      if (err.response?.status === 401) {
        alert('Vui lòng đăng nhập trước!')
        navigate('/login')
      } else {
        alert('Không thể thêm vào giỏ hàng!')
      }
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-8">
      <div className="bg-white rounded-xl shadow p-4 md:p-6">
        
        {/* Phần trên — Ảnh + Thông tin */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">

          {/* Ảnh */}
          <div className="w-full md:w-1/2">
            <img
                src={getImageUrl(anhHienThi)}
                alt={sanPham.product_name}
                className="w-full h-64 md:h-80 object-contain rounded-lg border"
            />
            <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
              {sanPham.images.map(img => (
                <img
                  key={img.image_id}
                  src={getImageUrl(img.image)}
                  alt=""
                  onClick={() => setAnhHienThi(img.image)}
                  className={`w-14 h-14 md:w-16 md:h-16 object-contain border-2 rounded cursor-pointer transition flex-shrink-0
                    ${anhHienThi === img.image
                      ? 'border-orange-500'
                      : 'border-gray-200 hover:border-orange-300'
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Thông tin */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">{sanPham.product_name}</h2>

            {/* Chọn dung lượng */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Dung lượng:</h4>
              <div className="flex flex-wrap gap-2">
                {dungLuongs.map(storage => (
                  <button
                    key={storage}
                    onClick={() => handleChonStorage(storage)}
                    className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg border font-medium transition text-sm md:text-base
                      ${storageChon === storage
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-gray-300 text-gray-600 hover:border-orange-400'
                      }`}
                  >
                    {storage}
                  </button>
                ))}
              </div>
            </div>

            {/* Chọn màu */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Màu sắc:</h4>
              <div className="flex flex-wrap gap-2">
                {mauTheoStorage.map(v => (
                  <button
                    key={v.variant_id}
                    onClick={() => setMauChon(v)}
                    className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg border font-medium transition text-sm md:text-base
                      ${mauChon?.variant_id === v.variant_id
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-gray-300 text-gray-600 hover:border-orange-400'
                      }`}
                  >
                    {v.color_name}
                  </button>
                ))}
              </div>
            </div>

            {/* Giá */}
            {mauChon && (
              <div className="flex flex-col gap-1">
                <p className="text-gray-400 line-through text-sm">
                  {Number(mauChon.original_price).toLocaleString('vi-VN')} đ
                </p>
                <p className="text-orange-500 text-2xl md:text-3xl font-bold">
                  {Number(mauChon.sale_price).toLocaleString('vi-VN')} đ
                </p>
                <p className="text-green-600 text-sm">Còn lại: {mauChon.stock} máy</p>
              </div>
            )}

            {/* 2 nút */}
            <div className="flex gap-3 mt-2">
              <button
                onClick={themVaoGio}
                className="flex-1 border-2 border-orange-500 text-orange-500 py-2.5 md:py-3 rounded-lg hover:bg-orange-50 transition font-semibold text-sm md:text-base"
              >
                Thêm vào giỏ
              </button>
              <button
                onClick={muaNgay}
                className="flex-1 bg-orange-500 text-white py-2.5 md:py-3 rounded-lg hover:bg-orange-600 transition font-semibold text-sm md:text-base"
              >
                Mua ngay
              </button>
            </div>
          </div>
        </div>

        {/* Thông số kỹ thuật */}
        <div className="mt-6 md:mt-8 border-t pt-6">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">📋 Thông số kỹ thuật</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { label: 'Màn hình', value: sanPham.screen },
              { label: 'Chip', value: sanPham.chip },
              { label: 'RAM', value: sanPham.ram },
              { label: 'Camera sau', value: sanPham.rear_camera },
              { label: 'Camera trước', value: sanPham.front_camera },
              { label: 'Pin', value: sanPham.battery },
              { label: 'Hệ điều hành', value: sanPham.operating_system },
              { label: 'Thương hiệu', value: sanPham.brand_name },
            ].map(item => (
              <div key={item.label} className="flex gap-2 bg-gray-50 rounded-lg p-3">
                <span className="text-gray-500 w-32 flex-shrink-0 text-sm">{item.label}:</span>
                <span className="font-medium text-gray-800 text-sm">{item.value || 'N/A'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mô tả */}
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">📝 Mô tả sản phẩm</h3>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">{sanPham.description}</p>
        </div>

      </div>
    </div>
  )
}

export default ProductDetail