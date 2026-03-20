export interface Car {
  id: string
  name: string
  shortName: string
  year: number
  price: number
  mileage: number
  color: string
  colorHex: string
  emoji: string
  engine: string
  power: string
  torque: string
  gearbox: string
  accel: string
  topSpeed: string
  vin: string
  dealScore: number
  verdict: string
  annualCost: number
  priceVsMarket: number
  depreciationYear: number
  motStatus: string
}

export interface Fault {
  id: number
  carId: string
  name: string
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low'
}

export interface MotHistory {
  id: number
  carId: string
  date: string
  result: string
  mileage: number | null
  notes: string | null
}

export interface PriceHistory {
  id: number
  carId: string
  date: string
  price: number
}

export interface MileageHistory {
  id: number
  carId: string
  date: string
  mileage: number
}

export interface Extra {
  id: number
  carId: string
  name: string
  price: number
  fitted: boolean
}

export interface Spec {
  id: number
  carId: string
  label: string
  value: string
}

export interface Cost {
  id: number
  carId: string
  label: string
  value: number
  color: string
}

export interface Community {
  id: number
  carId: string
  name: string
  type: string
  icon: string
  url: string
}

export interface ServiceSchedule {
  id: number
  carId: string
  item: string
  interval: string
  nextDue: string
  urgent: boolean
}

export interface CarFull extends Car {
  faults: Fault[]
  motHistory: MotHistory[]
  priceHistory: PriceHistory[]
  mileageHistory: MileageHistory[]
  extras: Extra[]
  specs: Spec[]
  costs: Cost[]
  communities: Community[]
  serviceSchedule: ServiceSchedule[]
}
