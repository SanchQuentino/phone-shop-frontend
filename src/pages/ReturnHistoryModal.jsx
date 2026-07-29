import { useState, useEffect } from 'react'
import api from '../services/api'

function ReturnHistoryModal({ isOpen, onClose }) {
  const [historyList, setHistoryList] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [historyError, setHistoryError] = useState('')

  useEffect(() => {
    if (isOpen) {
      fetchHistory()
    }
  }, [isOpen])

  const fetchHistory = async () => {
    setLoadingHistory(true)
    setHistoryError('')
    try {
      const res = await api.get('/api/return-requests/my-requests')
      if (res.data?.success) {
        setHistoryList(res.data.data || [])
      } else {
        setHistoryList([])
      }
    } catch (err) {
      console.error('Lỗi tải lịch sử đổi trả:', err)
      setHistoryError('Không thể tải lịch sử yêu cầu!')
    } finally {
      setLoadingHistory(false)
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Đã gửi yêu cầu':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'Đã tiếp nhận':
      case 'Đang kiểm tra':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Đã chấp nhận':
      case 'Hoàn thành':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'Từ chối':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl relative max-h-[85vh] flex flex-col">
        
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
             Lịch sử Yêu cầu Đổi trả / Bảo hành
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold px-2"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto flex-1 pr-1">
          {loadingHistory ? (
            <div className="text-center py-10 text-gray-500 text-sm">Đang tải dữ liệu...</div>
          ) : historyError ? (
            <div className="text-center py-10 text-red-500 text-sm">{historyError}</div>
          ) : historyList.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-2"></p>
              <p className="text-sm">Bạn chưa gửi yêu cầu đổi trả hoặc bảo hành nào!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {historyList.map((req) => (
                <div key={req.request_id} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-2">
                  <div className="flex flex-wrap justify-between items-center gap-2 border-b border-gray-200 pb-2">
                    <div>
                      <span className="font-bold text-gray-800 text-sm">
                        Yêu cầu #{req.request_id}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        (Đơn hàng #{req.order_id})
                      </span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(req.status)}`}>
                      {req.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-gray-600">
                    <p><strong>Loại yêu cầu:</strong> {req.request_type}</p>
                    <p><strong>Phương thức:</strong> {req.return_method}</p>
                    <p><strong>Ngày gửi:</strong> {req.created_at ? new Date(req.created_at).toLocaleDateString('vi-VN') : 'N/A'}</p>
                  </div>

                  <div className="text-xs bg-white p-2.5 rounded-lg border border-gray-100">
                    <span className="font-semibold text-gray-700">Lý do: </span>
                    <span className="text-gray-600">{req.reason}</span>
                  </div>

                  {req.admin_note && (
                    <div className="text-xs bg-indigo-50 border border-indigo-100 text-indigo-900 p-2.5 rounded-lg">
                      <span className="font-bold"> Ghi chú từ Cửa hàng: </span>
                      <span>{req.admin_note}</span>
                    </div>
                  )}

                  {req.images && req.images.length > 0 && (
                    <div className="pt-1">
                      <p className="text-xs font-semibold text-gray-600 mb-1.5">Ảnh đính kèm:</p>
                      <div className="flex flex-wrap gap-2">
                        {req.images.map((img, idx) => (
                          <a key={idx} href={img} target="_blank" rel="noopener noreferrer">
                            <img
                              src={img}
                              alt={`Bằng chứng ${idx + 1}`}
                              className="w-12 h-12 object-cover rounded border border-gray-300 hover:scale-105 transition"
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-3 border-t mt-3 text-right">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-gray-300 transition"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  )
}

export default ReturnHistoryModal