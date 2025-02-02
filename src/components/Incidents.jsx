import { useState, useEffect } from 'react'
import { getIncidents, createIncident, updateIncidentStatus } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function Incidents() {
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    type: '',
    location: '',
    severity: '1',
    status: 'New'
  })

  useEffect(() => {
    loadIncidents()
  }, [])

  const loadIncidents = async () => {
    try {
      const data = await getIncidents()
      setIncidents(data)
    } catch (error) {
      toast.error('Failed to load incidents')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createIncident({
        ...formData,
        severity: parseInt(formData.severity)
      })
      toast.success('Incident reported successfully')
      setShowForm(false)
      setFormData({ type: '', location: '', severity: '1', status: 'New' })
      loadIncidents()
    } catch (error) {
      toast.error('Failed to report incident')
    }
  }

  const handleStatusUpdate = async (incidentId, newStatus) => {
    try {
      await updateIncidentStatus(incidentId, newStatus)
      toast.success('Status updated successfully')
      loadIncidents()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Emergency Incidents</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showForm ? 'Cancel' : 'Report Incident'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
                placeholder="e.g., Traffic Accident"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                placeholder="Address or coordinates"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Severity</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="1">Low</option>
                <option value="2">Medium</option>
                <option value="3">High</option>
                <option value="4">Critical</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Report Incident
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {incidents.map((incident) => (
          <div key={incident.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">{incident.type}</h3>
              <span
                className={`px-2 py-1 text-sm rounded ${getSeverityColor(
                  incident.severity
                )}`}
              >
                {getSeverityLabel(incident.severity)}
              </span>
            </div>
            <p className="text-gray-600 mt-2">{incident.location}</p>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={incident.status}
                onChange={(e) => handleStatusUpdate(incident.id, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Reported: {new Date(incident.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function getSeverityLabel(severity) {
  switch (severity) {
    case 1:
      return 'Low'
    case 2:
      return 'Medium'
    case 3:
      return 'High'
    case 4:
      return 'Critical'
    default:
      return 'Unknown'
  }
}

function getSeverityColor(severity) {
  switch (severity) {
    case 1:
      return 'bg-green-100 text-green-800'
    case 2:
      return 'bg-yellow-100 text-yellow-800'
    case 3:
      return 'bg-orange-100 text-orange-800'
    case 4:
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}