// User types
export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: UserRole
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export enum UserRole {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  PARAMEDIC = 'PARAMEDIC',
  STAFF = 'STAFF'
}

// Hospital types
export interface Hospital {
  id: number
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  email: string
  capacity: number
  currentOccupancy: number
  emergencyCapacity: number
  coordinates: {
    lat: number
    lng: number
  }
}

// Patient types
export interface Patient {
  id: number
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  bloodType: string
  allergies: string[]
  medicalHistory: string
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
}

// Emergency types
export interface Emergency {
  id: number
  type: EmergencyType
  priority: EmergencyPriority
  location: {
    address: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  status: EmergencyStatus
  description: string
  patientCount: number
  assignedUnits: string[]
  createdAt: string
  updatedAt: string
}

export enum EmergencyType {
  MEDICAL = 'MEDICAL',
  TRAUMA = 'TRAUMA',
  FIRE = 'FIRE',
  ACCIDENT = 'ACCIDENT'
}

export enum EmergencyPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum EmergencyStatus {
  PENDING = 'PENDING',
  DISPATCHED = 'DISPATCHED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
} 