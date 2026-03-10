import axios from 'axios'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ''}/api`,
  withCredentials: true,
})

export default api

// Types
export interface LigneDevis {
  id: string
  designation: string
  quantite: number
  unite: string
  prix_unitaire_facture: number
  total_facture: number
  type: 'MATERIEL' | 'MAIN_OEUVRE' | 'MIXTE'
  prix_unitaire_estime?: number
  prix_median?: number
  prix_p25?: number
  prix_p75?: number
  niveau_confiance?: 'FORT' | 'MOYEN' | 'FAIBLE'
  sources: string[]
  mixte_valide: boolean
}

export interface DevisResult {
  lignes: LigneDevis[]
}

export interface SalarieInput {
  nom: string
  role: 'Chef de chantier' | 'Ouvrier' | 'Apprenti'
  taux_horaire: number
  temps_prevu: number
}

export interface DirigentInput {
  taux_horaire: number
  temps_prevu: number
  unite: 'heures' | 'jours'
}

export interface CalculMORequest {
  salaries: SalarieInput[]
  dirigeant: DirigentInput
  coefficient_charges: number
}

export interface CalculMOResponse {
  cout_brut: number
  charges: number
  cout_total: number
  coefficient: number
}

export interface Chantier {
  id: string
  nom: string
  metier: string
  date: string
  ca: number
  cout_mo: number
  cout_materiaux: number
  cout_total: number
  gain: number
  marge: number
}

export interface Salarie {
  id: string
  nom: string
  role: string
  taux_horaire: number
}

// API calls
export const devisApi = {
  upload: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post<DevisResult>('/devis/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  estimerPrix: (lignes: LigneDevis[]) =>
    api.post<DevisResult>('/devis/estimer-prix', lignes),
}

export const authApi = {
  register: (email: string, password: string) =>
    api.post('/auth/register', { email, password }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
}

export const chantierApi = {
  calculMO: (data: CalculMORequest) =>
    api.post<CalculMOResponse>('/chantiers/calcul-mo', data),
  save: (data: object) =>
    api.post<Chantier>('/chantiers/save', data),
  getHistorique: () =>
    api.get<Chantier[]>('/chantiers/historique'),
  getSalaries: () =>
    api.get<Salarie[]>('/chantiers/salaries'),
  createSalarie: (data: { nom: string; role: string; taux_horaire: number }) =>
    api.post<Salarie>('/chantiers/salaries', data),
  updateSalarie: (id: string, data: { nom: string; role: string; taux_horaire: number }) =>
    api.put<Salarie>(`/chantiers/salaries/${id}`, data),
  deleteSalarie: (id: string) =>
    api.delete(`/chantiers/salaries/${id}`),
}

export const exportApi = {
  excel: (data: object) =>
    api.post('/export/excel', data, { responseType: 'blob' }),
}
