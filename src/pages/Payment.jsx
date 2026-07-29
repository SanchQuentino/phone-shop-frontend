import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

function Payment() {
  const { orderId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [copiedField, setCopiedField] = useState('')

  const {
    qrCodeUrl,
    total_amount,
    receiver_name,
    receiver_phone,
    shipping_address,
    items
  } = location.state || {}

  const bankInfo = {
    bankName: 'Ngân hàng MB (MBBank)',
    accountNo: '0962076965',
    accountName: 'NGUYEN CONG VINH',
    memo: `DH${orderId}`,
    amount: total_amount || 0
  }

  // Nếu truy cập trực tiếp không có dữ liệu state
  if (!qrCodeUrl && !orderId) {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 text-center bg-white rounded-2xl shadow">
        <p className="text-gray-500 text-lg mb-4">Không tìm thấy thông tin đơn hàng thanh toán!</p>
        <button
          onClick={() => navigate('/orders')}
          className="bg-orange-500 text-white px-5 py-2.5 rounded-xl hover:bg-orange-600"
        >
          Xem lịch sử đơn hàng
        </button>
      </div>
    )
  }

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(''), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Tiêu đề & Cảnh báo */}
      <div className="text-center mb-8">
        <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
          Thanh toán chuyển khoản
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">
          Đơn hàng #{orderId}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Vui lòng quét mã QR bên dưới hoặc chuyển khoản theo đúng nội dung bên cạnh
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">

        {/* Cột 1: Hiển thị Mã QR VietQR */}
        <div className="flex flex-col items-center justify-center p-4 bg-orange-50/40 border border-orange-100 rounded-2xl">
          <div className="bg-white p-3 rounded-xl shadow-md border mb-3">
            <img
              src={qrCodeUrl || `https://img.vietqr.io/image/MB-0962076965-qr_only.png?amount=${bankInfo.amount}&addInfo=${bankInfo.memo}&accountName=${encodeURIComponent(bankInfo.accountName)}`}
              alt="Mã QR VietQR Thanh toán"
              className="w-56 h-56 md:w-64 md:h-64 object-contain"
            />
          </div>
          <p className="text-xs text-center text-gray-500 flex items-center gap-1">
            <span>💡</span> Mở App Ngân hàng bất kỳ & Quét mã QR
          </p>
        </div>

        {/* Cột 2: Chi tiết thông tin tài khoản ngân hàng */}
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-4 pb-2 border-b">
              Thông tin chuyển khoản
            </h3>

            <div className="space-y-3.5 text-sm">
              <div>
                <p className="text-xs text-gray-500">Ngân hàng thụ hưởng</p>
                <p className="font-semibold text-gray-800">{bankInfo.bankName}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Chủ tài khoản</p>
                <p className="font-semibold text-gray-800">{bankInfo.accountName}</p>
              </div>

              <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg border">
                <div>
                  <p className="text-xs text-gray-500">Số tài khoản</p>
                  <p className="font-bold text-orange-600 text-base">{bankInfo.accountNo}</p>
                </div>
                <button
                  onClick={() => handleCopy(bankInfo.accountNo, 'stk')}
                  className="text-xs bg-white border text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-100 font-medium"
                >
                  {copiedField === 'stk' ? '✓ Đã chép' : 'Sao chép'}
                </button>
              </div>

              <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg border">
                <div>
                  <p className="text-xs text-gray-500">Số tiền thanh toán</p>
                  <p className="font-bold text-orange-600 text-base">{Number(bankInfo.amount).toLocaleString('vi-VN')} đ</p>
                </div>
                <button
                  onClick={() => handleCopy(bankInfo.amount, 'amount')}
                  className="text-xs bg-white border text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-100 font-medium"
                >
                  {copiedField === 'amount' ? '✓ Đã chép' : 'Sao chép'}
                </button>
              </div>

              <div className="flex justify-between items-center bg-orange-50 border border-orange-200 p-2.5 rounded-lg">
                <div>
                  <p className="text-xs text-orange-700 font-medium">Nội dung chuyển khoản (Bắt buộc)</p>
                  <p className="font-bold text-orange-600 text-base">{bankInfo.memo}</p>
                </div>
                <button
                  onClick={() => handleCopy(bankInfo.memo, 'memo')}
                  className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded-md hover:bg-orange-600 font-medium"
                >
                  {copiedField === 'memo' ? '✓ Đã chép' : 'Sao chép'}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t flex flex-col gap-2">
            <button
              onClick={() => {
                alert('Hệ thống đã ghi nhận đơn hàng của bạn và đang đợi xác nhận thanh toán!')
                navigate('/orders')
              }}
              className="w-full bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 transition font-semibold"
            >
              Tôi đã hoàn tất chuyển khoản
            </button>
            <button
              onClick={() => navigate('/orders')}
              className="w-full text-center text-xs text-gray-500 hover:text-gray-700 py-1"
            >
              Xem đơn hàng của tôi
            </button>
          </div>

        </div>

      </div>

      {/* Thông tin người nhận ngắn gọn phía dưới */}
      {receiver_name && (
        <div className="mt-6 bg-white p-4 rounded-xl border border-gray-100 text-xs text-gray-600 flex flex-col md:flex-row justify-between gap-2">
          <p><span className="font-semibold text-gray-700">Người nhận:</span> {receiver_name} - {receiver_phone}</p>
          <p><span className="font-semibold text-gray-700">Địa chỉ:</span> {shipping_address}</p>
        </div>
      )}
    </div>
  )
}

export default Payment