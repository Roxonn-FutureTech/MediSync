import { useState, useEffect } from 'react'
import { getHospitals, createHospital, updateHospitalCapacity } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function Hospitals() {
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    capacity: ''
  })

  useEffect(() => {
    loadHospitals()
  }, [])

  const loadHospitals = async () => {
    try {
      const data = await getHospitals()
      setHospitals(data)
    } catch (error) {
      toast.error('Failed to load hospitals')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createHospital({
        ...formData,
        capacity: parseInt(formData.capacity)
      })
      toast.success('Hospital added successfully')
      setShowForm(false)
      setFormData({ name: '', address: '', phone: '', capacity: '' })
      loadHospitals()
    } catch (error) {
      toast.error('Failed to add hospital')
    }
  }

  const handleCapacityUpdate = async (hospitalId, newCapacity) => {
    try {
      await updateHospitalCapacity(hospitalId, parseInt(newCapacity))
      toast.success('Capacity updated successfully')
      loadHospitals()
    } catch (error) {
      toast.error('Failed to update capacity')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hospitals</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showForm ? 'Cancel' : 'Add Hospital'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Capacity</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                required
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Hospital
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {hospitals.map((hospital) => (
          <div key={hospital.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">{hospital.name}</h3>
            <p className="text-gray-600">{hospital.address}</p>
            <p className="text-gray-600">{hospital.phone}</p>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Current Capacity
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <input
                  type="number"
                  defaultValue={hospital.capacity}
                  min="0"
                  className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  onBlur={(e) => handleCapacityUpdate(hospital.id, e.target.value)}
                />
                <span className="text-sm text-gray-500">beds</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}