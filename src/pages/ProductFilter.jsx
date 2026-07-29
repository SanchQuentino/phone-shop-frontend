import { useState } from 'react'

function ProductFilter({ onApplyFilter, onResetFilter }) {
  const [isOpen, setIsOpen] = useState(true)
  const [minPrice, setMinPrice] = useState(1000000)
  const [maxPrice, setMaxPrice] = useState(100000000)

  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedOS, setSelectedOS] = useState([])
  const [selectedRam, setSelectedRam] = useState([])
  const [selectedStorage, setSelectedStorage] = useState([])
  const [selectedChip, setSelectedChip] = useState([])
  const [selectedScreen, setSelectedScreen] = useState([])
  const [selectedBattery, setSelectedBattery] = useState([])

  const brandOptions = ['Iphone', 'Samsung', 'Vivo', 'Xiaomi', 'Oppo']
  const osOptions = ['Android', 'iOS']
  const ramOptions = ['6 GB', '8 GB', '12 GB', '16 GB', '18 GB']
  const storageOptions = ['128 GB', '256 GB', '512 GB', '1 TB', '2 TB']
  const chipOptions = [
    'Apple A-series',
    'Snapdragon',
    'Exynos',
    'MediaTek',
    'MediaTek Dimensity',
    'MediaTek Helio',
    'Unisoc'
  ]
  const screenOptions = ['Retina', 'AMOLED', 'IPS LCD', 'OLED', 'LCD', 'TFT']
  const batteryOptions = [
    '1000mAh - 4000mAh',
    '4000mAh - 5000mAh',
    '5000mAh - 6000mAh',
    '6000mAh - 7000mAh',
    '>7000mAh'
  ]

  const handleToggle = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item))
    } else {
      setList([...list, item])
    }
  }

  const handleApply = () => {
    const ramValues = selectedRam.map(r => r.replace(/\D/g, ''))
    const filterParams = {
      min_price: minPrice,
      max_price: maxPrice,
      brands: selectedBrands.join(','),
      os: selectedOS.join(','),
      ram: ramValues.join(','),
      storage: selectedStorage.map(s => s.replace(/\s+/g, '')).join(','),
      chip: selectedChip.join(','),
      screen: selectedScreen.join(','),
      battery: selectedBattery.join(',')
    }
    onApplyFilter(filterParams)
  }

  const handleReset = () => {
    setMinPrice(1000000)
    setMaxPrice(100000000)
    setSelectedBrands([])
    setSelectedOS([])
    setSelectedRam([])
    setSelectedStorage([])
    setSelectedChip([])
    setSelectedScreen([])
    setSelectedBattery([])
    if (onResetFilter) onResetFilter()
  }

  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 transition-all">
      <div className="flex justify-between items-start pb-3 border-b border-gray-100">
        <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
           Bộ lọc sản phẩm
        </h3>

        <div className="flex flex-col items-end gap-1">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs font-medium text-gray-500 hover:text-orange-500 transition"
          >
            {isOpen ? 'Thu gọn ▲' : 'Mở bộ lọc ▼'}
          </button>

          {isOpen && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-orange-500 hover:underline font-semibold"
            >
              Xóa tất cả
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="mt-5 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Khoảng giá
            </label>
            <div className="flex items-center gap-1 text-xs font-bold text-orange-600 mb-3 bg-orange-50 p-2.5 rounded-xl border border-orange-100 justify-between">
              <span>{Number(minPrice).toLocaleString('vi-VN')} đ</span>
              <span>-</span>
              <span>{Number(maxPrice).toLocaleString('vi-VN')} đ</span>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-500">Thấp nhất</span>
                <input
                  type="range"
                  min="1000000"
                  max="100000000"
                  step="1000000"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - 1000000))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>
              <div>
                <span className="text-xs text-gray-500">Cao nhất</span>
                <input
                  type="range"
                  min="1000000"
                  max="100000000"
                  step="1000000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + 1000000))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Hãng sản xuất</label>
            <div className="flex flex-wrap gap-2">
              {brandOptions.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => handleToggle(brand, selectedBrands, setSelectedBrands)}
                  className={`px-3 py-1.5 text-xs rounded-xl border font-medium transition ${
                    selectedBrands.includes(brand)
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Hệ điều hành</label>
            <div className="flex flex-wrap gap-2">
              {osOptions.map((os) => (
                <button
                  key={os}
                  type="button"
                  onClick={() => handleToggle(os, selectedOS, setSelectedOS)}
                  className={`px-3 py-1.5 text-xs rounded-xl border font-medium transition ${
                    selectedOS.includes(os)
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {os}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">RAM</label>
            <div className="flex flex-wrap gap-2">
              {ramOptions.map((ram) => (
                <button
                  key={ram}
                  type="button"
                  onClick={() => handleToggle(ram, selectedRam, setSelectedRam)}
                  className={`px-3 py-1.5 text-xs rounded-xl border font-medium transition ${
                    selectedRam.includes(ram)
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {ram}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Bộ nhớ trong</label>
            <div className="flex flex-wrap gap-2">
              {storageOptions.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleToggle(st, selectedStorage, setSelectedStorage)}
                  className={`px-3 py-1.5 text-xs rounded-xl border font-medium transition ${
                    selectedStorage.includes(st)
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Chip xử lý</label>
            <div className="flex flex-wrap gap-2">
              {chipOptions.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleToggle(chip, selectedChip, setSelectedChip)}
                  className={`px-3 py-1.5 text-xs rounded-xl border font-medium transition ${
                    selectedChip.includes(chip)
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Công nghệ màn hình</label>
            <div className="flex flex-wrap gap-2">
              {screenOptions.map((screen) => (
                <button
                  key={screen}
                  type="button"
                  onClick={() => handleToggle(screen, selectedScreen, setSelectedScreen)}
                  className={`px-3 py-1.5 text-xs rounded-xl border font-medium transition ${
                    selectedScreen.includes(screen)
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {screen}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Dung lượng Pin</label>
            <div className="flex flex-wrap gap-2">
              {batteryOptions.map((battery) => (
                <button
                  key={battery}
                  type="button"
                  onClick={() => handleToggle(battery, selectedBattery, setSelectedBattery)}
                  className={`px-3 py-1.5 text-xs rounded-xl border font-medium transition ${
                    selectedBattery.includes(battery)
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {battery}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2">
            <button
              onClick={handleApply}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-2xl text-sm shadow transition"
            >
              Áp dụng lọc
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full text-center text-xs font-medium text-gray-500 hover:text-orange-500 py-1 transition"
            >
              ▲ Thu gọn bộ lọc
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductFilter