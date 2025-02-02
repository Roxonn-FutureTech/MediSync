import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for data operations
export const getHospitals = async () => {
  const { data, error } = await supabase
    .from('hospitals')
    .select('*')
    .order('name')
  if (error) throw error
  return data
}

export const getIncidents = async () => {
  const { data, error } = await supabase
    .from('emergency_incidents')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const getTransfers = async () => {
  const { data, error } = await supabase
    .from('patient_transfers')
    .select(`
      *,
      from_hospital:hospitals!from_hospital_id(name),
      to_hospital:hospitals!to_hospital_id(name)
    `)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const createHospital = async (hospitalData) => {
  const { data, error } = await supabase
    .from('hospitals')
    .insert([hospitalData])
    .select()
  if (error) throw error
  return data[0]
}

export const createIncident = async (incidentData) => {
  const { data, error } = await supabase
    .from('emergency_incidents')
    .insert([incidentData])
    .select()
  if (error) throw error
  return data[0]
}

export const createTransfer = async (transferData) => {
  const { data, error } = await supabase
    .from('patient_transfers')
    .insert([transferData])
    .select()
  if (error) throw error
  return data[0]
}

export const updateHospitalCapacity = async (hospitalId, capacity) => {
  const { data, error } = await supabase
    .from('hospitals')
    .update({ capacity })
    .eq('id', hospitalId)
    .select()
  if (error) throw error
  return data[0]
}

export const updateIncidentStatus = async (incidentId, status) => {
  const { data, error } = await supabase
    .from('emergency_incidents')
    .update({ status })
    .eq('id', incidentId)
    .select()
  if (error) throw error
  return data[0]
}

export const updateTransferStatus = async (transferId, status) => {
  const { data, error } = await supabase
    .from('patient_transfers')
    .update({ status })
    .eq('id', transferId)
    .select()
  if (error) throw error
  return data[0]
}