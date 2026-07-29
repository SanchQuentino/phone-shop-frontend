import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function Orders() {
  const [donHang, setDonHang] = useState([])
  const [loi, setLoi] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

useEffect(() => {
  api.get('/api/order/my-orders')
    .then(res => {
      // 🎯 IN DỮ LIỆU BẮT ĐƯỢC RA CONSOLE BÌNH THƯỜNG
      console.log('>>> Dữ liệu API trả về:', res.data);
      
      if (res.data && Array.isArray(res.data.data)) {
        console.log('>>> Mảng danh sách đơn hàng:', res.data.data);
        console.log('>>> Mảng items của đơn đầu tiên:', res.data.data[0]?.items);
        setDonHang(res.data.data)
      } else {
        setDonHang([])
      }
    })
    .catch(err => {
      console.error('>>> Lỗi gọi API:', err);
      setLoi('Không thể tải đơn hàng!')
    })
    .finally(() => {
      setLoading(false)
    })
}, [navigate])

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Đang tải lịch sử đơn hàng...</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
        Lịch sử đơn hàng
      </h2>

      {loi && <p className="text-red-500 mb-4">{loi}</p>}

      {!donHang || donHang.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-6xl mb-4">📦</p>
          <p className="text-lg mb-6">Chưa có đơn hàng nào!</p>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition font-semibold"
          >
            Mua sắm ngay
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {donHang.map(dh => (
            <div key={dh.order_id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
              
              {/* Tiêu đề đơn hàng */}
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                <h4 className="font-bold text-gray-800 text-base md:text-lg">
                  Đơn hàng #{dh.order_id}
                </h4>
                <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${
                  dh.order_status === 'Đã xác nhận'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {dh.order_status || 'Chờ xác nhận'}
                </span>
              </div>

              {/* Thông tin chung */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
                <p><strong>Người nhận:</strong> {dh.receiver_name || 'N/A'}</p>
                <p><strong>Ngày đặt:</strong> {dh.created_at ? new Date(dh.created_at).toLocaleDateString('vi-VN') : 'N/A'}</p>
                <p><strong>Hình thức giao:</strong> {dh.shipping_method || 'Giao hàng tận nơi'}</p>
                <p><strong>Thanh toán:</strong> {dh.payment_method || 'Thanh toán khi nhận hàng (COD)'}</p>
              </div>

              {/* Danh sách sản phẩm */}
              <div className="border-t pt-3">
                <p className="font-semibold text-gray-700 mb-3">
                  Sản phẩm đã mua:
                </p>

                <div className="space-y-3">
                  {dh.items && dh.items.length > 0 ? (
                    dh.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm py-2 border-b border-dashed border-gray-100 last:border-none">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {item.product_name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Phân loại: {item.color || 'Mặc định'} {item.storage && `- ${item.storage}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-gray-700">x{item.quantity}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 italic">Không tìm thấy thông tin sản phẩm.</p>
                  )}
                </div>
              </div>

              {/* Tổng tiền */}
              <div className="border-t mt-4 pt-3 flex justify-end items-center gap-2">
                <span className="text-gray-600 text-sm">Tổng thanh toán:</span>
                <span className="text-orange-600 font-bold text-lg md:text-xl">
                  {Number(dh.total_amount || 0).toLocaleString('vi-VN')} đ
                </span>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders