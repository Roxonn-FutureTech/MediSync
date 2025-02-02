import { useState, useEffect } from 'react'
import { getHospitals, getIncidents, getTransfers } from '../lib/supabase'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalHospitals: 0,
    totalBeds: 0,
    activeIncidents: 0,
    pendingTransfers: 0
  })
  const [loading, setLoading] = useState(true)
  const [severityData, setSeverityData] = useState({
    labels: ['Low', 'Medium', 'High', 'Critical'],
    datasets: [
      {
        label: 'Incidents by Severity',
        data: [0, 0, 0, 0],
        backgroundColor: [
          'rgba(34, 197, 94, 0.5)',
          'rgba(234, 179, 8, 0.5)',
          'rgba(249, 115, 22, 0.5)',
          'rgba(239, 68, 68, 0.5)'
        ]
      }
    ]
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [hospitals, incidents, transfers] = await Promise.all([
        getHospitals(),
        getIncidents(),
        getTransfers()
      ])

      // Calculate total beds and hospitals
      const totalBeds = hospitals.reduce((sum, h) => sum + h.capacity, 0)

      // Count active incidents
      const activeIncidents = incidents.filter(
        (i) => i.status !== 'Resolved'
      ).length

      // Count pending transfers
      const pendingTransfers = transfers.filter(
        (t) => t.status === 'Pending'
      ).length

      setStats({
        totalHospitals: hospitals.length,
        totalBeds,
        activeIncidents,
        pendingTransfers
      })

      // Calculate severity distribution
      const severityCounts = [0, 0, 0, 0]
      incidents.forEach((incident) => {
        if (incident.severity >= 1 && incident.severity <= 4) {
          severityCounts[incident.severity - 1]++
        }
      })

      setSeverityData({
        ...severityData,
        datasets: [
          {
            ...severityData.datasets[0],
            data: severityCounts
          }
        ]
      })
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Total Hospitals</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {stats.totalHospitals}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Total Bed Capacity</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {stats.totalBeds}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Active Incidents</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {stats.activeIncidents}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Pending Transfers</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {stats.pendingTransfers}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Incident Severity Distribution
        </h3>
        <div className="h-64">
          <Bar
            data={severityData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}