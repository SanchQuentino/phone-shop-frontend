import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'

// Helper xử lý chuẩn giá tiền từ DB ("3899000.00") hoặc từ Input ("3.899.000")
const cleanPriceNumber = (value) => {
  if (value === null || value === undefined || value === '') return ''
  const num = typeof value === 'number' ? value : Number(value)
  if (!isNaN(num)) {
    return Math.round(num)
  }
  const cleanStr = String(value).replace(/\D/g, '')
  return cleanStr ? Number(cleanStr) : ''
}

const formatMoneyInput = (value) => {
  const num = cleanPriceNumber(value)
  if (num === '' || isNaN(num)) return ''
  return new Intl.NumberFormat('vi-VN').format(num)
}

const unformatMoneyInput = (value) => {
  const num = cleanPriceNumber(value)
  return num === '' ? '' : String(num)
}

function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [attributes, setAttributes] = useState({ categories: [], brands: [], colors: [], storages: [] })
  const [loading, setLoading] = useState(false)
  const [loi, setLoi] = useState('')

  const [formData, setFormData] = useState({
    category_id: '', brand_id: '', product_name: '', description: ''
  })

  const [specs, setSpecs] = useState({
    screen: '', chip: '', ram: '', rear_camera: '', front_camera: '', battery: '', operating_system: ''
  })

  const [variants, setVariants] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attrRes, detailRes] = await Promise.all([
          api.get('/api/admin/attributes/all'),
          api.get(`/api/products/${id}`)
        ])

        if (attrRes.data?.success) {
          setAttributes(attrRes.data.data || { categories: [], brands: [], colors: [], storages: [] })
        }

        if (detailRes.data?.success) {
          const data = detailRes.data.data
          setFormData({
            category_id: data.category_id || '',
            brand_id: data.brand_id || '',
            product_name: data.product_name || '',
            description: data.description || ''
          })
          setSpecs({
            screen: data.screen || '',
            chip: data.chip || '',
            ram: data.ram || '',
            rear_camera: data.rear_camera || '',
            front_camera: data.front_camera || '',
            battery: data.battery || '',
            operating_system: data.operating_system || ''
          })
          
          // Làm sạch giá tiền ban đầu lấy từ DB về
          const cleanedVariants = (data.variants || []).map(v => ({
            ...v,
            original_price: unformatMoneyInput(v.original_price),
            sale_price: unformatMoneyInput(v.sale_price)
          }))
          setVariants(cleanedVariants)
        }
      } catch (err) {
        setLoi('Không thể tải chi tiết sản phẩm!')
      }
    }
    fetchData()
  }, [id])

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants]
    if (field === 'original_price' || field === 'sale_price') {
      updated[index][field] = unformatMoneyInput(value)
    } else {
      updated[index][field] = value
    }
    setVariants(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoi('')

    try {
      setLoading(true)

      const payload = {
        category_id: formData.category_id,
        brand_id: formData.brand_id,
        product_name: formData.product_name,
        description: formData.description,
        specs,
        variants: variants.map(v => ({
          variant_id: v.variant_id,
          original_price: unformatMoneyInput(v.original_price),
          sale_price: unformatMoneyInput(v.sale_price),
          stock: v.stock
        }))
      }

      const res = await api.put(`/api/admin/products/update/${id}`, payload)

      if (res.data?.success) {
        alert(res.data.message || 'Cập nhật thành công!')
        navigate('/admin')
      }
    } catch (err) {
      setLoi(err.response?.data?.message || 'Cập nhật thất bại!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">✏️ Chỉnh sửa sản phẩm #{id}</h2>
      {loi && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{loi}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">1. Thông tin chung</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Danh mục</label>
              <select
                className="w-full border p-2 rounded text-sm"
                value={formData.category_id}
                onChange={e => setFormData({ ...formData, category_id: e.target.value })}
              >
                <option value="">-- Chọn danh mục --</option>
                {(attributes.categories || []).map(c => <option key={c.category_id} value={c.category_id}>{c.category_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Thương hiệu</label>
              <select
                className="w-full border p-2 rounded text-sm"
                value={formData.brand_id}
                onChange={e => setFormData({ ...formData, brand_id: e.target.value })}
              >
                <option value="">-- Chọn thương hiệu --</option>
                {(attributes.brands || []).map(b => <option key={b.brand_id} value={b.brand_id}>{b.brand_name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
            <input
              type="text"
              className="w-full border p-2 rounded text-sm"
              value={formData.product_name}
              onChange={e => setFormData({ ...formData, product_name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mô tả</label>
            <textarea
              rows="3"
              className="w-full border p-2 rounded text-sm"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">2. Thông số kỹ thuật</h3>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Màn hình" className="border p-2 rounded text-sm" value={specs.screen} onChange={e => setSpecs({...specs, screen: e.target.value})} />
            <input type="text" placeholder="Chip" className="border p-2 rounded text-sm" value={specs.chip} onChange={e => setSpecs({...specs, chip: e.target.value})} />
            <input type="text" placeholder="RAM" className="border p-2 rounded text-sm" value={specs.ram} onChange={e => setSpecs({...specs, ram: e.target.value})} />
            <input type="text" placeholder="Pin" className="border p-2 rounded text-sm" value={specs.battery} onChange={e => setSpecs({...specs, battery: e.target.value})} />
            <input type="text" placeholder="Camera sau" className="border p-2 rounded text-sm" value={specs.rear_camera} onChange={e => setSpecs({...specs, rear_camera: e.target.value})} />
            <input type="text" placeholder="Camera trước" className="border p-2 rounded text-sm" value={specs.front_camera} onChange={e => setSpecs({...specs, front_camera: e.target.value})} />
            <input type="text" placeholder="Hệ điều hành" className="border p-2 rounded text-sm col-span-2" value={specs.operating_system} onChange={e => setSpecs({...specs, operating_system: e.target.value})} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">3. Cập nhật Giá & Kho biến thể</h3>
          {variants.map((v, idx) => (
            <div key={v.variant_id || idx} className="grid grid-cols-4 gap-2 items-center bg-gray-50 p-3 rounded">
              <div className="text-xs font-semibold text-gray-700">
                {v.color_name} - {v.storage_name}
              </div>
              <div>
                <label className="text-[10px] text-gray-500">Giá gốc</label>
                <input
                  type="text"
                  className="border p-1 rounded text-xs w-full"
                  value={formatMoneyInput(v.original_price)}
                  onChange={e => handleVariantChange(idx, 'original_price', e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500">Giá bán</label>
                <input
                  type="text"
                  className="border p-1 rounded text-xs w-full"
                  value={formatMoneyInput(v.sale_price)}
                  onChange={e => handleVariantChange(idx, 'sale_price', e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500">Kho</label>
                <input
                  type="number"
                  className="border p-1 rounded text-xs w-full"
                  value={v.stock}
                  onChange={e => handleVariantChange(idx, 'stock', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
        >
          {loading ? 'Đang lưu...' : 'Cập nhật sản phẩm'}
        </button>
      </form>
    </div>
  )
}

export default EditProduct