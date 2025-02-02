import { useState, useEffect } from 'react'
import { getTransfers, createTransfer, updateTransferStatus, getHospitals } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function Transfers() {
  const [transfers, setTransfers] = useState([])
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    from_hospital_id: '',
    to_hospital_id: '',
    patient_condition: '',
    status: 'Pending'
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [transfersData, hospitalsData] = await Promise.all([
        getTransfers(),
        getHospitals()
      ])
      setTransfers(transfersData)
      setHospitals(hospitalsData)
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.from_hospital_id === formData.to_hospital_id) {
      toast.error('Source and destination hospitals must be different')
      return
    }

    try {
      await createTransfer(formData)
      toast.success('Transfer request created successfully')
      setShowForm(false)
      setFormData({
        from_hospital_id: '',
        to_hospital_id: '',
        patient_condition: '',
        status: 'Pending'
      })
      loadData()
    } catch (error) {
      toast.error('Failed to create transfer request')
    }
  }

  const handleStatusUpdate = async (transferId, newStatus) => {
    try {
      await updateTransferStatus(transferId, newStatus)
      toast.success('Status updated successfully')
      loadData()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Patient Transfers</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showForm ? 'Cancel' : 'New Transfer'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                From Hospital
              </label>
              <select
                value={formData.from_hospital_id}
                onChange={(e) =>
                  setFormData({ ...formData, from_hospital_id: e.target.value })
                }
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Hospital</option>
                {hospitals.map((hospital) => (
                  <option key={hospital.id} value={hospital.id}>
                    {hospital.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                To Hospital
              </label>
              <select
                value={formData.to_hospital_id}
                onChange={(e) =>
                  setFormData({ ...formData, to_hospital_id: e.target.value })
                }
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Hospital</option>
                {hospitals.map((hospital) => (
                  <option key={hospital.id} value={hospital.id}>
                    {hospital.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Patient Condition
              </label>
              <textarea
                value={formData.patient_condition}
                onChange={(e) =>
                  setFormData({ ...formData, patient_condition: e.target.value })
                }
                required
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Describe the patient's condition and any special requirements"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create Transfer Request
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {transfers.map((transfer) => (
          <div key={transfer.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">
                  {transfer.from_hospital.name} → {transfer.to_hospital.name}
                </h3>
                <p className="text-gray-600 mt-2">{transfer.patient_condition}</p>
              </div>
              <span
                className={`px-2 py-1 text-sm rounded ${getStatusColor(
                  transfer.status
                )}`}
              >
                {transfer.status}
              </span>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={transfer.status}
                onChange={(e) => handleStatusUpdate(transfer.id, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="In Transit">In Transit</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Requested: {new Date(transfer.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function getStatusColor(status) {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'In Transit':
      return 'bg-blue-100 text-blue-800'
    case 'Completed':
      return 'bg-green-100 text-green-800'
    case 'Cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}