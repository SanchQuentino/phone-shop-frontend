import { useState, useEffect } from 'react'
import api from '../services/api'

function CreateReturnModal({ isOpen, onClose, selectedOrder }) {
  const [selectedItemId, setSelectedItemId] = useState('')
  const [requestType, setRequestType] = useState('Đổi sản phẩm')
  const [returnMethod, setReturnMethod] = useState('Mang đến cửa hàng')
  const [reason, setReason] = useState('')
  const [files, setFiles] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')

  useEffect(() => {
    if (isOpen) {
      setSelectedItemId('')
      setRequestType('Đổi sản phẩm')
      setReturnMethod('Mang đến cửa hàng')
      setReason('')
      setFiles([])
      setFormError('')
      setFormSuccess('')
    }
  }, [isOpen])

  if (!isOpen || !selectedOrder) return null

  const handleSubmitReturn = async (e) => {
    e.preventDefault()
    if (!reason.trim()) {
      setFormError('Vui lòng nhập lý do chi tiết!')
      return
    }

    try {
      setSubmitting(true)
      setFormError('')

      const formData = new FormData()
      formData.append('order_id', selectedOrder.order_id)
      if (selectedItemId) {
        formData.append('order_item_id', selectedItemId)
      }
      formData.append('request_type', requestType)
      formData.append('return_method', returnMethod)
      formData.append('reason', reason)

      if (files && files.length > 0) {
        Array.from(files).forEach((file) => {
          formData.append('images', file)
        })
      }

      const res = await api.post('/api/return-requests/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (res.data?.success) {
        setFormSuccess('Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ lại sớm nhất.')
        setTimeout(() => {
          onClose()
        }, 1800)
      }
    } catch (err) {
      console.error('Lỗi gửi yêu cầu đổi trả:', err)
      setFormError(err.response?.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu!')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            Gửi yêu cầu Đổi trả / Bảo hành
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold px-2"
          >
            ✕
          </button>
        </div>

        {formError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-xs">
            {formError}
          </div>
        )}

        {formSuccess && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-xs font-semibold">
            {formSuccess}
          </div>
        )}

        <form onSubmit={handleSubmitReturn} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Mã đơn hàng</label>
            <input 
              type="text" 
              disabled 
              value={`#${selectedOrder.order_id}`} 
              className="w-full bg-gray-100 border text-gray-600 rounded-lg p-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Sản phẩm cần đổi trả / bảo hành
            </label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
              <option value="">-- Tất cả sản phẩm trong đơn --</option>
              {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                <option key={item.order_item_id || idx} value={item.order_item_id}>
                  {item.product_name} ({item.color || 'Mặc định'}{item.storage ? ` - ${item.storage}` : ''}) - SL: {item.quantity}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Loại yêu cầu <span className="text-red-500">*</span></label>
            <select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
              className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
              <option value="Đổi sản phẩm">Đổi sản phẩm</option>
              <option value="Trả hàng">Trả hàng</option>
              <option value="Bảo hành">Bảo hành</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Phương thức gửi hàng <span className="text-red-500">*</span></label>
            <select
              value={returnMethod}
              onChange={(e) => setReturnMethod(e.target.value)}
              className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
              <option value="Mang đến cửa hàng">Mang đến cửa hàng</option>
              <option value="Gửi chuyển phát">Gửi chuyển phát</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Lý do chi tiết <span className="text-red-500">*</span></label>
            <textarea
              rows="3"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Mô tả chi tiết tình trạng lỗi hoặc lý do..."
              className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Ảnh bằng chứng (tối đa 15 ảnh)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setFiles(e.target.files)}
              className="w-full border rounded-lg p-2 text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          <div className="flex gap-3 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 bg-gray-100 text-gray-700 py-2.5 rounded-lg text-xs font-semibold hover:bg-gray-200 transition"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-1/2 bg-indigo-600 text-white py-2.5 rounded-lg text-xs font-bold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateReturnModal