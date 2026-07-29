import { useState, useEffect } from 'react'
import api from '../../services/api'

function ManageOrdersModal({ isOpen, onClose }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [loi, setLoi] = useState('')
  const [thongBao, setThongBao] = useState('')
  const [filterStatus, setFilterStatus] = useState('Tất cả')

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await api.get('/api/order/admin/all')
      if (res.data?.success) {
        setOrders(res.data.data || [])
      }
    } catch (err) {
      setLoi('Lỗi khi tải danh sách đơn hàng!')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchOrders()
      setLoi('')
      setThongBao('')
    }
  }, [isOpen])

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/api/orders/admin/update-status/${orderId}`, {
        order_status: newStatus
      })
      if (res.data?.success) {
        setThongBao(`Đã cập nhật đơn #${orderId} thành "${newStatus}"`)
        setOrders(prev =>
          prev.map(o => (o.order_id === orderId ? { ...o, order_status: newStatus } : o))
        )
      }
    } catch (err) {
      setLoi('Không thể cập nhật trạng thái đơn hàng!')
    }
  }

  const handleConfirmPayment = async (orderId) => {
    const code = window.prompt(`Nhập mã giao dịch chuyển khoản cho đơn #${orderId} (nếu có):`)
    if (code === null) return // Khách hủy prompt

    try {
      const res = await api.put(`/api/orders/admin/confirm-payment/${orderId}`, {
        transaction_code: code
      })
      if (res.data?.success) {
        setThongBao(`Đã xác nhận thanh toán thành công cho đơn #${orderId}`)
        setOrders(prev =>
          prev.map(o => (o.order_id === orderId ? { ...o, payment_status: 'Đã thanh toán' } : o))
        )
      }
    } catch (err) {
      setLoi('Lỗi khi xác nhận thanh toán!')
    }
  }

  if (!isOpen) return null

  const filteredOrders = orders.filter(o => 
    filterStatus === 'Tất cả' ? true : o.order_status === filterStatus
  )

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header Modal */}
        <div className="p-5 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Quản lý Đơn hàng Hệ thống</h3>
            <p className="text-xs text-gray-500 mt-1">Duyệt đơn hàng, kiểm tra chuyển khoản QR và cập nhật tiến độ giao</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
        </div>

        {/* Status Filter Bar */}
        <div className="p-4 bg-gray-100 border-b flex gap-2 flex-wrap items-center text-xs font-semibold">
          <span className="text-gray-600 mr-2">Lọc trạng thái:</span>
          {['Tất cả', 'Chờ xác nhận', 'Đã xác nhận', 'Đang giao', 'Đã giao', 'Đã hủy'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-full transition ${
                filterStatus === st
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Alert Messages */}
        {loi && <div className="mx-6 mt-3 p-2 bg-red-100 text-red-700 text-xs rounded">{loi}</div>}
        {thongBao && <div className="mx-6 mt-3 p-2 bg-green-100 text-green-700 text-xs rounded">{thongBao}</div>}

        {/* Body Table */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Đang tải danh sách đơn hàng...</div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600 uppercase">
                  <th className="p-3">Mã đơn</th>
                  <th className="p-3">Khách hàng</th>
                  <th className="p-3">Địa chỉ giao</th>
                  <th className="p-3">Tổng tiền</th>
                  <th className="p-3">Thanh toán</th>
                  <th className="p-3">Trạng thái đơn</th>
                  <th className="p-3 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-400">Không tìm thấy đơn hàng nào.</td>
                  </tr>
                ) : (
                  filteredOrders.map(o => (
                    <tr key={o.order_id} className="hover:bg-gray-50">
                      <td className="p-3 font-bold text-blue-600">#{o.order_id}</td>
                      <td className="p-3">
                        <div className="font-semibold text-gray-800">{o.receiver_name}</div>
                        <div className="text-gray-500">{o.receiver_phone}</div>
                      </td>
                      <td className="p-3 max-w-xs truncate text-gray-600" title={o.shipping_address}>
                        {o.shipping_address}
                      </td>
                      <td className="p-3 font-bold text-orange-600">
                        {Number(o.total_amount).toLocaleString('vi-VN')} đ
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-gray-700">{o.payment_method}</div>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                          o.payment_status === 'Đã thanh toán' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {o.payment_status || 'Chưa thanh toán'}
                        </span>
                      </td>
                      <td className="p-3">
                        <select
                          className="border rounded p-1 text-xs font-medium bg-white"
                          value={o.order_status}
                          onChange={e => handleUpdateStatus(o.order_id, e.target.value)}
                        >
                          <option value="Chờ xác nhận">Chờ xác nhận</option>
                          <option value="Đã xác nhận">Đã xác nhận</option>
                          <option value="Đang giao">Đang giao</option>
                          <option value="Đã giao">Đã giao</option>
                          <option value="Đã hủy">Đã hủy</option>
                        </select>
                      </td>
                      <td className="p-3 text-center space-x-1">
                        {o.payment_status !== 'Đã thanh toán' && (
                          <button
                            onClick={() => handleConfirmPayment(o.order_id)}
                            className="bg-emerald-600 text-white px-2.5 py-1 rounded hover:bg-emerald-700 text-[11px] shadow-sm"
                            title="Xác nhận khách đã chuyển tiền thành công"
                          >
                            ✓ Tiền đã về
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default ManageOrdersModal