import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

const formatMoneyInput = (value) => {
  if (!value && value !== 0) return ''
  const cleanNumber = String(value).replace(/\D/g, '')
  if (!cleanNumber) return ''
  return new Intl.NumberFormat('vi-VN').format(cleanNumber)
}

const unformatMoneyInput = (value) => {
  if (!value) return ''
  return String(value).replace(/\D/g, '')
}

function AddProduct() {
  const navigate = useNavigate()
  const [attributes, setAttributes] = useState({ categories: [], brands: [], colors: [], storages: [] })
  const [loading, setLoading] = useState(false)
  const [loi, setLoi] = useState('')

  const [formData, setFormData] = useState({
    category_id: '',
    brand_id: '',
    product_name: '',
    description: ''
  })

  const [specs, setSpecs] = useState({
    screen: '', chip: '', ram: '', rear_camera: '', front_camera: '', battery: '', operating_system: ''
  })

  const [variants, setVariants] = useState([
    { color_id: '', storage_id: '', original_price: '', sale_price: '', stock: '' }
  ])

  const [mainImage, setMainImage] = useState(null)
  const [galleryImages, setGalleryImages] = useState([])

  const fetchAttributes = async () => {
    try {
      const res = await api.get('/api/admin/attributes/all')
      if (res.data?.success) {
        setAttributes(res.data.data)
      }
    } catch (err) {
      console.error('Lỗi tải thuộc tính:', err)
    }
  }

  useEffect(() => {
    fetchAttributes()
  }, [])

  const handleAddVariant = () => {
    setVariants([...variants, { color_id: '', storage_id: '', original_price: '', sale_price: '', stock: '' }])
  }

  const handleRemoveVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

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

    if (!mainImage) {
      setLoi('Vui lòng chọn ảnh chính sản phẩm!')
      return
    }

    try {
      setLoading(true)
      const sendData = new FormData()

      sendData.append('category_id', formData.category_id)
      sendData.append('brand_id', formData.brand_id)
      sendData.append('product_name', formData.product_name)
      sendData.append('description', formData.description)

      sendData.append('specs', JSON.stringify(specs))
      sendData.append('variants', JSON.stringify(variants))

      sendData.append('main_image', mainImage)
      Array.from(galleryImages).forEach(file => {
        sendData.append('gallery_images', file)
      })

      const res = await api.post('/api/admin/products/create', sendData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (res.data?.success) {
        alert(res.data.message || 'Thêm sản phẩm thành công!')
        navigate('/admin')
      }
    } catch (err) {
      setLoi(err.response?.data?.message || 'Có lỗi xảy ra khi thêm sản phẩm!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">➕ Thêm sản phẩm mới</h2>
      {loi && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{loi}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">1. Thông tin chung</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Danh mục (*)</label>
              <select
                required
                className="w-full border p-2 rounded text-sm"
                value={formData.category_id}
                onChange={e => setFormData({ ...formData, category_id: e.target.value })}
              >
                <option value="">-- Chọn danh mục --</option>
                {attributes.categories.map(c => (
                  <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Thương hiệu (*)</label>
              <select
                required
                className="w-full border p-2 rounded text-sm"
                value={formData.brand_id}
                onChange={e => setFormData({ ...formData, brand_id: e.target.value })}
              >
                <option value="">-- Chọn thương hiệu --</option>
                {attributes.brands.map(b => (
                  <option key={b.brand_id} value={b.brand_id}>{b.brand_name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tên sản phẩm (*)</label>
            <input
              type="text"
              required
              className="w-full border p-2 rounded text-sm"
              placeholder="VD: iPhone 15 Pro Max"
              value={formData.product_name}
              onChange={e => setFormData({ ...formData, product_name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mô tả sản phẩm</label>
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
            <input type="text" placeholder="Chip / CPU" className="border p-2 rounded text-sm" value={specs.chip} onChange={e => setSpecs({...specs, chip: e.target.value})} />
            <input type="text" placeholder="RAM" className="border p-2 rounded text-sm" value={specs.ram} onChange={e => setSpecs({...specs, ram: e.target.value})} />
            <input type="text" placeholder="Pin" className="border p-2 rounded text-sm" value={specs.battery} onChange={e => setSpecs({...specs, battery: e.target.value})} />
            <input type="text" placeholder="Camera sau" className="border p-2 rounded text-sm" value={specs.rear_camera} onChange={e => setSpecs({...specs, rear_camera: e.target.value})} />
            <input type="text" placeholder="Camera trước" className="border p-2 rounded text-sm" value={specs.front_camera} onChange={e => setSpecs({...specs, front_camera: e.target.value})} />
            <input type="text" placeholder="Hệ điều hành" className="border p-2 rounded text-sm col-span-2" value={specs.operating_system} onChange={e => setSpecs({...specs, operating_system: e.target.value})} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-semibold">3. Biến thể sản phẩm</h3>
            <button type="button" onClick={handleAddVariant} className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded font-medium">
              + Thêm dòng biến thể
            </button>
          </div>

          {variants.map((v, idx) => (
            <div key={idx} className="grid grid-cols-6 gap-2 items-center bg-gray-50 p-3 rounded">
              <select required className="border p-1.5 rounded text-xs" value={v.color_id} onChange={e => handleVariantChange(idx, 'color_id', e.target.value)}>
                <option value="">-- Màu sắc --</option>
                {attributes.colors.map(c => <option key={c.color_id} value={c.color_id}>{c.color_name}</option>)}
              </select>

              <select required className="border p-1.5 rounded text-xs" value={v.storage_id} onChange={e => handleVariantChange(idx, 'storage_id', e.target.value)}>
                <option value="">-- Dung lượng --</option>
                {attributes.storages.map(s => <option key={s.storage_id} value={s.storage_id}>{s.storage_name}</option>)}
              </select>

              <input
                type="text"
                placeholder="Giá gốc"
                required
                className="border p-1.5 rounded text-xs"
                value={formatMoneyInput(v.original_price)}
                onChange={e => handleVariantChange(idx, 'original_price', e.target.value)}
              />

              <input
                type="text"
                placeholder="Giá bán"
                required
                className="border p-1.5 rounded text-xs"
                value={formatMoneyInput(v.sale_price)}
                onChange={e => handleVariantChange(idx, 'sale_price', e.target.value)}
              />

              <input
                type="number"
                placeholder="Kho"
                required
                className="border p-1.5 rounded text-xs"
                value={v.stock}
                onChange={e => handleVariantChange(idx, 'stock', e.target.value)}
              />

              {variants.length > 1 && (
                <button type="button" onClick={() => handleRemoveVariant(idx)} className="text-red-500 text-xs font-bold">Xóa</button>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">4. Ảnh sản phẩm (Cloudinary)</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Ảnh chính (*)</label>
            <input type="file" accept="image/*" required onChange={e => setMainImage(e.target.files[0])} className="w-full border p-2 rounded text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bộ ảnh phụ</label>
            <input type="file" accept="image/*" multiple onChange={e => setGalleryImages(e.target.files)} className="w-full border p-2 rounded text-sm" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition"
        >
          {loading ? 'Đang tải ảnh & Lưu...' : 'Thêm sản phẩm'}
        </button>
      </form>
    </div>
  )
}

export default AddProduct