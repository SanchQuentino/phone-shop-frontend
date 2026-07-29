import { useState, useEffect } from 'react'
import api from '../../services/api'

function ManageReturnsModal({ isOpen, onClose }) {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [loi, setLoi] = useState('')
  const [thongBao, setThongBao] = useState('')

  const [selectedReq, setSelectedReq] = useState(null)
  const [statusInput, setStatusInput] = useState('')
  const [adminNoteInput, setAdminNoteInput] = useState('')

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const res = await api.get('/api/return-requests/admin/all')
      if (res.data?.success) {
        setRequests(res.data.data || [])
      }
    } catch (err) {
      setLoi('Lỗi khi lấy danh sách yêu cầu đổi trả!')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchRequests()
      setLoi('')
      setThongBao('')
      setSelectedReq(null)
    }
  }, [isOpen])

  const handleOpenEdit = (reqItem) => {
    setSelectedReq(reqItem)
    setStatusInput(reqItem.status)
    setAdminNoteInput(reqItem.admin_note || '')
  }

  const handleSaveStatus = async (e) => {
    e.preventDefault()
    if (!selectedReq) return

    try {
      const res = await api.put(`/api/return-requests/admin/update-status/${selectedReq.request_id}`, {
        status: statusInput,
        admin_note: adminNoteInput
      })

      if (res.data?.success) {
        setThongBao(res.data.message || 'Cập nhật thành công!')
        setRequests(prev =>
          prev.map(r =>
            r.request_id === selectedReq.request_id
              ? { ...r, status: statusInput, admin_note: adminNoteInput }
              : r
          )
        )
        setSelectedReq(null)
      }
    } catch (err) {
      setLoi(err.response?.data?.message || 'Lỗi cập nhật trạng thái yêu cầu!')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="p-5 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-xl font-bold text-gray-800"> Quản lý Đổi trả & Bảo hành</h3>
            <p className="text-xs text-gray-500 mt-1">Xử lý các đơn khiếu nại, xem ảnh bằng chứng và cập nhật phản hồi</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
        </div>

        {loi && <div className="mx-6 mt-3 p-2 bg-red-100 text-red-700 text-xs rounded">{loi}</div>}
        {thongBao && <div className="mx-6 mt-3 p-2 bg-green-100 text-green-700 text-xs rounded">{thongBao}</div>}

        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 overflow-x-auto">
            {loading ? (
              <div className="text-center py-10 text-gray-500">Đang tải danh sách...</div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-600 uppercase">
                    <th className="p-3">Mã YC</th>
                    <th className="p-3">Đơn hàng</th>
                    <th className="p-3">Khách hàng</th>
                    <th className="p-3">Loại YC</th>
                    <th className="p-3">Trạng thái</th>
                    <th className="p-3 text-center">Chi tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {requests.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-gray-400">Chưa có yêu cầu đổi trả nào.</td>
                    </tr>
                  ) : (
                    requests.map(r => (
                      <tr key={r.request_id} className={`hover:bg-gray-50 ${selectedReq?.request_id === r.request_id ? 'bg-blue-50/60' : ''}`}>
                        <td className="p-3 font-bold text-indigo-600">#{r.request_id}</td>
                        <td className="p-3 font-medium text-gray-700">Đơn #{r.order_id}</td>
                        <td className="p-3">
                          <div className="font-semibold text-gray-800">{r.customer_name}</div>
                          <div className="text-gray-500">{r.customer_phone}</div>
                        </td>
                        <td className="p-3">
                          <span className="bg-purple-100 text-purple-700 font-semibold px-2 py-0.5 rounded text-[10px]">
                            {r.request_type}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-gray-700">{r.status}</span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleOpenEdit(r)}
                            className="bg-blue-600 text-white px-2.5 py-1 rounded hover:bg-blue-700 text-[11px]"
                          >
                            Xử lý
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border flex flex-col">
            <h4 className="font-bold text-sm text-gray-800 border-b pb-2 mb-3">Chi tiết xử lý yêu cầu</h4>

            {selectedReq ? (
              <form onSubmit={handleSaveStatus} className="space-y-4 text-xs flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-500">Mã yêu cầu:</span> <strong className="text-gray-800">#{selectedReq.request_id}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500">Hình thức nhận:</span> <span className="font-medium">{selectedReq.return_method}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Lý do từ khách hàng:</span>
                    <p className="bg-white p-2 border rounded mt-1 text-gray-700 italic">{selectedReq.reason}</p>
                  </div>

                  <div>
                    <span className="text-gray-500 block mb-1">Ảnh bằng chứng ({selectedReq.images?.length || 0}):</span>
                    <div className="flex gap-2 flex-wrap">
                      {selectedReq.images && selectedReq.images.length > 0 ? (
                        selectedReq.images.map((imgUrl, idx) => (
                          <a key={idx} href={imgUrl} target="_blank" rel="noreferrer">
                            <img src={imgUrl} alt="evidence" className="w-14 h-14 object-cover rounded border hover:scale-105 transition" />
                          </a>
                        ))
                      ) : (
                        <span className="text-gray-400 italic">Không có ảnh đính kèm</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Cập nhật trạng thái (*):</label>
                    <select
                      className="w-full border p-2 rounded bg-white text-xs font-semibold"
                      value={statusInput}
                      onChange={e => setStatusInput(e.target.value)}
                    >
                      <option value="Đã gửi yêu cầu">Đã gửi yêu cầu</option>
                      <option value="Đã tiếp nhận">Đã tiếp nhận</option>
                      <option value="Đang kiểm tra">Đang kiểm tra</option>
                      <option value="Đã chấp nhận">Đã chấp nhận</option>
                      <option value="Từ chối">Từ chối</option>
                      <option value="Hoàn thành">Hoàn thành</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Ghi chú cho khách hàng (Admin Note):</label>
                    <textarea
                      rows="3"
                      className="w-full border p-2 rounded text-xs bg-white"
                      placeholder="VD: Đã gửi sản phẩm thay thế qua ViettelPost, mã vận đơn VT123..."
                      value={adminNoteInput}
                      onChange={e => setAdminNoteInput(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition mt-4"
                >
                  Lưu thay đổi
                </button>
              </form>
            ) : (
              <div className="text-center py-12 text-gray-400 text-xs italic">
                Chọn 1 yêu cầu ở danh sách bên trái để tiến hành xử lý.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageReturnsModal