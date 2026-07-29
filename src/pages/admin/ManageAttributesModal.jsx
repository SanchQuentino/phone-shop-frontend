import { useState, useEffect } from 'react'
import api from '../../services/api'

function ManageAttributesModal({ isOpen, onClose, onRefresh }) {
  const [data, setData] = useState({ categories: [], brands: [], colors: [], storages: [] })
  const [activeTab, setActiveTab] = useState('colors') // 'colors' | 'storages' | 'brands' | 'categories'
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const fetchAll = async () => {
    try {
      const res = await api.get('/api/admin/attributes/all')
      if (res.data?.success) {
        setData(res.data.data)
      }
    } catch (err) {
      console.error('Lỗi tải thuộc tính:', err)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchAll()
      setMessage('')
      setInputValue('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    setLoading(true)
    setMessage('')

    try {
      let endpoint = ''
      let payload = {}

      if (activeTab === 'colors') {
        endpoint = '/api/admin/attributes/colors'
        payload = { color_name: inputValue }
      } else if (activeTab === 'storages') {
        endpoint = '/api/admin/attributes/storage'
        payload = { storage_name: inputValue }
      } else if (activeTab === 'brands') {
        endpoint = '/api/admin/attributes/brand'
        payload = { brand_name: inputValue }
      } else if (activeTab === 'categories') {
        endpoint = '/api/admin/attributes/category'
        payload = { category_name: inputValue }
      }

      const res = await api.post(endpoint, payload)
      if (res.data?.success) {
        setMessage( res.data.message)
        setInputValue('')
        await fetchAll()
        if (onRefresh) onRefresh()
      }
    } catch (err) {
      setMessage( (err.response?.data?.message || 'Có lỗi xảy ra!'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">⚙️ Quản lý Thuộc tính Sản phẩm</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b text-sm font-medium bg-gray-100">
          <button
            onClick={() => { setActiveTab('colors'); setMessage(''); }}
            className={`flex-1 py-3 text-center border-b-2 ${activeTab === 'colors' ? 'border-orange-500 text-orange-600 bg-white font-bold' : 'text-gray-600'}`}
          >
             Màu sắc ({data.colors.length})
          </button>
          <button
            onClick={() => { setActiveTab('storages'); setMessage(''); }}
            className={`flex-1 py-3 text-center border-b-2 ${activeTab === 'storages' ? 'border-orange-500 text-orange-600 bg-white font-bold' : 'text-gray-600'}`}
          >
             Dung lượng ({data.storages.length})
          </button>
          <button
            onClick={() => { setActiveTab('brands'); setMessage(''); }}
            className={`flex-1 py-3 text-center border-b-2 ${activeTab === 'brands' ? 'border-orange-500 text-orange-600 bg-white font-bold' : 'text-gray-600'}`}
          >
             Thương hiệu ({data.brands.length})
          </button>
          <button
            onClick={() => { setActiveTab('categories'); setMessage(''); }}
            className={`flex-1 py-3 text-center border-b-2 ${activeTab === 'categories' ? 'border-orange-500 text-orange-600 bg-white font-bold' : 'text-gray-600'}`}
          >
             Danh mục ({data.categories.length})
          </button>
        </div>

        {/* Form Thêm */}
        <div className="p-6 border-b bg-gray-50/50">
          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              type="text"
              required
              className="flex-1 border p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder={
                activeTab === 'colors' ? 'Nhập tên màu (VD: Titanium Tự Nhiên)...' :
                activeTab === 'storages' ? 'Nhập dung lượng (VD: 1TB, 512GB)...' :
                activeTab === 'brands' ? 'Nhập tên hãng (VD: Apple, Samsung)...' :
                'Nhập tên danh mục (VD: Điện thoại, Máy tính bảng)...'
              }
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 text-white px-5 py-2.5 rounded-lg hover:bg-orange-600 transition font-semibold text-sm"
            >
              {loading ? 'Đang thêm...' : '+ Thêm mới'}
            </button>
          </form>
          {message && <p className="text-xs mt-2 font-medium">{message}</p>}
        </div>

        {/* Danh sách hiển thị */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex flex-wrap gap-2">
            {activeTab === 'colors' && data.colors.map(item => (
              <span key={item.color_id} className="bg-gray-100 border px-3 py-1.5 rounded-lg text-sm text-gray-700 font-medium">
                {item.color_name}
              </span>
            ))}
            {activeTab === 'storages' && data.storages.map(item => (
              <span key={item.storage_id} className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-semibold">
                {item.storage_name}
              </span>
            ))}
            {activeTab === 'brands' && data.brands.map(item => (
              <span key={item.brand_id} className="bg-purple-50 border border-purple-200 text-purple-700 px-3 py-1.5 rounded-lg text-sm font-semibold">
                {item.brand_name}
              </span>
            ))}
            {activeTab === 'categories' && data.categories.map(item => (
              <span key={item.category_id} className="bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-lg text-sm font-semibold">
                {item.category_name}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 text-right">
          <button onClick={onClose} className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium text-sm">
            Đóng
          </button>
        </div>

      </div>
    </div>
  )
}

export default ManageAttributesModal