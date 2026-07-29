import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    return `https://web-ban-dien-thoai-production.up.railway.app/${path}`;
};

function Cart() {
  const [gioHang, setGioHang] = useState([])
  const [loi, setLoi] = useState('')
  const [dangTai, setDangTai] = useState(true)
  const [dangDatHang, setDangDatHang] = useState(false)
  const [isMember, setIsMember] = useState(false)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
      receiver_name: '',
      receiver_phone: '',
      receiver_email: '',
      address_detail: '',
      ward: '',
      province: '',
      shipping_method: 'Giao hàng tận nơi',
      payment_method: 'Chuyển khoản QR',
      address_id: null
  })

  useEffect(() => {
    const fetchCart = api.get('/api/cart/member')
    
    const fetchCheckoutInfo = api.get('/api/order/checkout-info')

    Promise.all([fetchCart, fetchCheckoutInfo])
      .then(([cartRes, checkoutRes]) => {
        setGioHang(cartRes.data.data || [])

        if (checkoutRes.data?.success && checkoutRes.data?.isMember && checkoutRes.data?.data) {
          setIsMember(true)
          const u = checkoutRes.data.data
          setFormData(prev => ({
            ...prev,
            receiver_name: u.full_name || '',
            receiver_email: u.email || '',
            receiver_phone: u.phone || '',
            address_id: u.address_id || null,
            address_detail: u.address_detail || '',
            ward: u.ward || '',
            province: u.province || ''
          }))
        }
        setDangTai(false)
      })
      .catch(err => {
        if (err.response?.status === 401) {
          navigate('/login')
        } else {
          setLoi('Không thể tải dữ liệu giỏ hàng!')
          setDangTai(false)
        }
      })
  }, [navigate])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const xoaItem = async (cart_item_id) => {
    try {
      await api.delete(`/api/cart/member/remove/${cart_item_id}`)
      setGioHang(gioHang.filter(item => item.cart_item_id !== cart_item_id))
    } catch (err) {
      alert('Không thể xóa sản phẩm!')
    }
  }

  const tamTinh = gioHang.reduce(
    (sum, item) => sum + Number(item.sale_price) * item.quantity,
    0
  )
  const phiVanChuyen = formData.shipping_method === 'Giao hàng tận nơi' ? 0 : 0
  const tongTien = tamTinh + phiVanChuyen

  const xuLyDatHang = async (e) => {
    e.preventDefault()

    if (gioHang.length === 0) {
      alert('Giỏ hàng của bạn đang trống!')
      return
    }

    if (!formData.receiver_name || !formData.receiver_phone) {
      alert('Vui lòng điền Họ tên và Số điện thoại người nhận!')
      return
    }

    if (formData.shipping_method === 'Giao hàng tận nơi' && !formData.address_detail) {
      alert('Vui lòng nhập Địa chỉ giao hàng chi tiết!')
      return
    }

    const fullAddress = formData.shipping_method === 'Nhận tại cửa hàng' 
      ? 'Nhận trực tiếp tại Cửa hàng'
      : [formData.address_detail, formData.ward, formData.province].filter(Boolean).join(', ')

    const items = gioHang.map(item => ({
      variant_id: item.variant_id,
      price: Number(item.sale_price),
      quantity: item.quantity
    }))

    const payload = {
      receiver_name: formData.receiver_name,
      receiver_phone: formData.receiver_phone,
      receiver_email: formData.receiver_email || null,
      shipping_address: fullAddress,
      shipping_method: formData.shipping_method,
      payment_method: formData.payment_method,
      address_id: formData.address_id,
      total_amount: tongTien,
      items: items,
      saveAddress: formData.saveAddress
    }

    try {
      setDangDatHang(true)
      const res = await api.post('/api/order/create', payload)

      if (res.data?.success) {
        const { orderId, paymentMethod, qrCodeUrl } = res.data

        if (paymentMethod === 'Chuyển khoản QR') {
          navigate(`/payment/${orderId}`, {
            state: {
              orderId,
              qrCodeUrl,
              total_amount: tongTien,
              receiver_name: formData.receiver_name,
              receiver_phone: formData.receiver_phone,
              shipping_address: fullAddress,
              items: gioHang
            }
          })
        } else {
          alert('Đặt hàng thành công! Cảm ơn bạn đã mua sắm.')
          navigate('/orders')
        }
      }
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Không thể tiến hành đặt hàng!')
    } finally {
      setDangDatHang(false)
    }
  }

  if (dangTai) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <p className="text-gray-500 font-medium">Đang tải giỏ hàng...</p>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Giỏ hàng & Thanh toán</h2>
      {loi && <p className="text-red-500 mb-4 bg-red-50 p-3 rounded-lg border border-red-200">{loi}</p>}

      {gioHang.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <p className="text-6xl mb-4">🛒</p>
          <p className="text-lg text-gray-600 mb-6">Giỏ hàng của bạn đang trống!</p>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition font-semibold shadow-md shadow-orange-200"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      ) : (
        <form onSubmit={xuLyDatHang} className="flex flex-col lg:flex-row gap-6">

          <div className="flex-1 flex flex-col gap-6">

            {/* Block 1: Danh sách sản phẩm */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5">
              <h3 className="font-bold text-gray-800 text-base md:text-lg mb-4 flex items-center gap-2">
                <span></span> Sản phẩm đã chọn ({gioHang.length})
              </h3>
              <div className="flex flex-col gap-4">
                {gioHang.map(item => (
                  <div key={item.cart_item_id} className="flex gap-3 md:gap-4 items-center p-3 bg-gray-50 rounded-xl">
                    <img
                      src={getImageUrl(item.product_image)}
                      alt={item.product_name}
                      className="w-20 h-20 object-contain border bg-white rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 text-sm md:text-base truncate">{item.product_name}</h4>
                      <p className="text-xs md:text-sm text-gray-500 mt-1">
                        Phân loại: <span className="font-medium text-gray-700">{item.color_name} | {item.storage_name}</span>
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-orange-500 font-bold text-sm md:text-base">
                          {Number(item.sale_price).toLocaleString('vi-VN')} đ
                        </p>
                        <span className="text-xs md:text-sm bg-white px-2 py-1 rounded border text-gray-600">
                          SL: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => xoaItem(item.cart_item_id)}
                      className="text-red-400 hover:text-red-600 transition font-medium px-2 py-1 hover:bg-red-50 rounded-lg text-sm flex-shrink-0"
                      title="Xóa sản phẩm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5">
              <h3 className="font-bold text-gray-800 text-base md:text-lg mb-4 flex items-center gap-2">
                <span></span> Thông tin giao hàng
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Họ và tên người nhận *</label>
                  <input
                    type="text"
                    name="receiver_name"
                    required
                    value={formData.receiver_name}
                    onChange={handleInputChange}
                    placeholder="Nguyễn Văn A"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Số điện thoại *</label>
                  <input
                    type="tel"
                    name="receiver_phone"
                    required
                    value={formData.receiver_phone}
                    onChange={handleInputChange}
                    placeholder="0912345678"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Email (Nhận thông báo đơn hàng)</label>
                  <input
                    type="email"
                    name="receiver_email"
                    value={formData.receiver_email}
                    onChange={handleInputChange}
                    placeholder="example@gmail.com"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="md:col-span-2 mt-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Hình thức nhận hàng</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition ${formData.shipping_method === 'Giao hàng tận nơi' ? 'border-orange-500 bg-orange-50 text-orange-600 font-medium' : 'border-gray-200 text-gray-700'}`}>
                      <input
                        type="radio"
                        name="shipping_method"
                        value="Giao hàng tận nơi"
                        checked={formData.shipping_method === 'Giao hàng tận nơi'}
                        onChange={handleInputChange}
                        className="accent-orange-500"
                      />
                      <span className="text-sm">🚚 Giao tận nơi</span>
                    </label>

                    <label className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition ${formData.shipping_method === 'Nhận tại cửa hàng' ? 'border-orange-500 bg-orange-50 text-orange-600 font-medium' : 'border-gray-200 text-gray-700'}`}>
                      <input
                        type="radio"
                        name="shipping_method"
                        value="Nhận tại cửa hàng"
                        checked={formData.shipping_method === 'Nhận tại cửa hàng'}
                        onChange={handleInputChange}
                        className="accent-orange-500"
                      />
                      <span className="text-sm">🏪 Nhận tại cửa hàng</span>
                    </label>
                  </div>
                </div>

                {formData.shipping_method === 'Giao hàng tận nơi' && (
                  <>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Địa chỉ chi tiết (Số nhà, Tên đường, Tòa nhà) *</label>
                      <input
                        type="text"
                        name="address_detail"
                        required={formData.shipping_method === 'Giao hàng tận nơi'}
                        value={formData.address_detail}
                        onChange={handleInputChange}
                        placeholder="Số 123 Đường Nguyễn Trãi"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Phường / Xã</label>
                      <input
                        type="text"
                        name="ward"
                        value={formData.ward}
                        onChange={handleInputChange}
                        placeholder="Phường Khương Trung"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Tỉnh / Thành phố</label>
                      <input
                        type="text"
                        name="province"
                        value={formData.province}
                        onChange={handleInputChange}
                        placeholder="Hà Nội"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </>
                )}

              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5">
              <h3 className="font-bold text-gray-800 text-base md:text-lg mb-4 flex items-center gap-2">
                <span></span> Phương thức thanh toán
              </h3>

              <div className="flex flex-col gap-3">
                <label className={`flex items-start gap-3 p-3.5 border rounded-xl cursor-pointer transition ${formData.payment_method === 'Chuyển khoản QR' ? 'border-orange-500 bg-orange-50/50 ring-1 ring-orange-500' : 'border-gray-200'}`}>
                  <input
                    type="radio"
                    name="payment_method"
                    value="Chuyển khoản QR"
                    checked={formData.payment_method === 'Chuyển khoản QR'}
                    onChange={handleInputChange}
                    className="mt-1 accent-orange-500"
                  />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                      <span></span> Chuyển khoản Online qua Mã QR (VietQR)
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Tự động tạo mã QR VietQR chuẩn ngân hàng MB. Khuyên dùng để xử lý đơn hàng nhanh hơn.
                    </p>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-3.5 border rounded-xl cursor-pointer transition ${formData.payment_method === 'Thanh toán khi nhận hàng' ? 'border-orange-500 bg-orange-50/50 ring-1 ring-orange-500' : 'border-gray-200'}`}>
                  <input
                    type="radio"
                    name="payment_method"
                    value="Thanh toán khi nhận hàng"
                    checked={formData.payment_method === 'Thanh toán khi nhận hàng'}
                    onChange={handleInputChange}
                    className="mt-1 accent-orange-500"
                  />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                      <span>💵</span> Thanh toán khi nhận hàng (COD)
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Thanh toán tiền mặt trực tiếp cho nhân viên giao hàng khi nhận được sản phẩm.
                    </p>
                  </div>
                </label>
              </div>
            </div>

          </div>

          <div className="w-full lg:w-96 h-fit bg-white rounded-xl shadow-sm border border-gray-100 p-5 lg:sticky lg:top-4">
            <h3 className="font-bold text-gray-800 text-lg mb-4 pb-3 border-b">Tóm tắt đơn hàng</h3>

            <div className="flex justify-between mb-3 text-gray-600 text-sm">
              <span>Tạm tính:</span>
              <span className="font-medium text-gray-800">{tamTinh.toLocaleString('vi-VN')} đ</span>
            </div>

            <div className="flex justify-between mb-3 text-gray-600 text-sm">
              <span>Phí vận chuyển:</span>
              <span className="text-green-600 font-medium">Miễn phí</span>
            </div>

            <div className="flex justify-between mb-3 text-gray-600 text-sm">
              <span>Hình thức:</span>
              <span className="text-gray-800 font-medium truncate max-w-[180px]">{formData.shipping_method}</span>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between font-bold text-orange-500 text-lg mb-6">
              <span>Tổng thanh toán:</span>
              <span className="text-xl">{tongTien.toLocaleString('vi-VN')} đ</span>
            </div>

            <button
              type="submit"
              disabled={dangDatHang}
              className={`w-full bg-orange-500 text-white py-3.5 rounded-xl hover:bg-orange-600 transition font-bold text-base shadow-md shadow-orange-200 ${dangDatHang ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {dangDatHang ? 'Đang xử lý...' : (formData.payment_method === 'Chuyển khoản QR' ? 'Tiến hành Thanh toán QR' : 'Đặt hàng ngay')}
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full mt-3 border border-gray-300 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition text-sm font-medium"
            >
              Tiếp tục mua sắm
            </button>
          </div>

        </form>
      )}
    </div>
  )
}

export default Cart