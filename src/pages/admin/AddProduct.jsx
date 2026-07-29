import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

function AddProduct() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    product_name: '',
    description: '',
    screen: '',
    chip: '',
    ram: '',
    rear_camera: '',
    front_camera: '',
    battery: '',
    operating_system: '',
    brand_id: '',
    category_id: '',
  })
  const [thongBao, setThongBao] = useState('')
  const [loi, setLoi] = useState('')
  const [dangLuu, setDangLuu] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoi('')
    setThongBao('')
    setDangLuu(true)
    try {
      const res = await api.post('/api/admin/products/create', form)
      if (res.data.success) {
        setThongBao('Thêm sản phẩm thành công!')
        setTimeout(() => navigate('/admin'), 1500)
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setLoi('Bạn không có quyền thực hiện thao tác này!')
      } else {
        setLoi(err.response?.data?.message || 'Không thể thêm sản phẩm!')
      }
    } finally {
      setDangLuu(false)
    }
  }

  const fields = [
    { name: 'product_name', label: 'Tên sản phẩm', required: true },
    { name: 'brand_id', label: 'Brand ID', required: true },
    { name: 'category_id', label: 'Category ID', required: true },
    { name: 'screen', label: 'Màn hình' },
    { name: 'chip', label: 'Chip' },
    { name: 'ram', label: 'RAM' },
    { name: 'rear_camera', label: 'Camera sau' },
    { name: 'front_camera', label: 'Camera trước' },
    { name: 'battery', label: 'Pin' },
    { name: 'operating_system', label: 'Hệ điều hành' },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin')}
          className="text-gray-500 hover:text-gray-700 transition"
        >
          ← Quay lại
        </button>
        <h2 className="text-2xl font-bold text-gray-800">➕ Thêm sản phẩm mới</h2>
      </div>

      {thongBao && (
        <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-4">
          ✅ {thongBao}
        </div>
      )}
      {loi && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
          ❌ {loi}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
        
        {/* Các field thông tin */}
        {fields.map(field => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              required={field.required}
              placeholder={`Nhập ${field.label.toLowerCase()}...`}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>
        ))}

        {/* Mô tả */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Nhập mô tả sản phẩm..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 text-sm resize-none"
          />
        </div>

        {/* Nút */}
        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg hover:bg-gray-50 transition font-semibold"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={dangLuu}
            className="flex-1 bg-orange-500 text-white py-2.5 rounded-lg hover:bg-orange-600 transition font-semibold disabled:opacity-50"
          >
            {dangLuu ? 'Đang lưu...' : 'Thêm sản phẩm'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddProduct