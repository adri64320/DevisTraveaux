import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { chantierApi, CalculMORequest, CalculMOResponse, Chantier, Salarie } from '../../services/api'

interface ChantierState {
  // Main d'oeuvre
  salariesInput: Array<{
    id: string
    nom: string
    role: 'Chef de chantier' | 'Ouvrier' | 'Apprenti'
    taux_horaire: number
    temps_prevu: number
  }>
  dirigeant: {
    taux_horaire: number
    temps_prevu: number
    unite: 'heures' | 'jours'
  }
  coefficientCharges: number
  calculMO: CalculMOResponse | null

  // Metier
  metier: string

  // Historique
  historique: Chantier[]

  // Salaries profils
  salariesProfils: Salarie[]

  // Slider simulation
  sliderValue: number

  loading: boolean
  error: string | null
}

const initialState: ChantierState = {
  salariesInput: [],
  dirigeant: { taux_horaire: 0, temps_prevu: 0, unite: 'heures' },
  coefficientCharges: 1.45,
  calculMO: null,
  metier: 'Électricien',
  historique: [],
  salariesProfils: [],
  sliderValue: 8,
  loading: false,
  error: null,
}

export const calculerMO = createAsyncThunk(
  'chantier/calculerMO',
  async (data: CalculMORequest, { rejectWithValue }) => {
    try {
      const response = await chantierApi.calculMO(data)
      return response.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Erreur de calcul')
    }
  }
)

export const fetchHistorique = createAsyncThunk(
  'chantier/fetchHistorique',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chantierApi.getHistorique()
      return response.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Erreur')
    }
  }
)

export const fetchSalariesProfils = createAsyncThunk(
  'chantier/fetchSalariesProfils',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chantierApi.getSalaries()
      return response.data
    } catch {
      return rejectWithValue('Non connecté')
    }
  }
)

export const saveChantier = createAsyncThunk(
  'chantier/save',
  async (data: object, { rejectWithValue }) => {
    try {
      const response = await chantierApi.save(data)
      return response.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Erreur')
    }
  }
)

const chantierSlice = createSlice({
  name: 'chantier',
  initialState,
  reducers: {
    setMetier(state, action: PayloadAction<string>) {
      state.metier = action.payload
    },
    setDirigeant(state, action: PayloadAction<Partial<ChantierState['dirigeant']>>) {
      state.dirigeant = { ...state.dirigeant, ...action.payload }
    },
    setCoefficientCharges(state, action: PayloadAction<number>) {
      state.coefficientCharges = action.payload
    },
    addSalarie(state, action: PayloadAction<ChantierState['salariesInput'][0]>) {
      state.salariesInput.push(action.payload)
    },
    updateSalarie(state, action: PayloadAction<{ id: string } & Partial<ChantierState['salariesInput'][0]>>) {
      const idx = state.salariesInput.findIndex(s => s.id === action.payload.id)
      if (idx !== -1) {
        state.salariesInput[idx] = { ...state.salariesInput[idx], ...action.payload }
      }
    },
    removeSalarie(state, action: PayloadAction<string>) {
      state.salariesInput = state.salariesInput.filter(s => s.id !== action.payload)
    },
    setSliderValue(state, action: PayloadAction<number>) {
      state.sliderValue = action.payload
    },
    resetChantier(state) {
      state.salariesInput = []
      state.dirigeant = { taux_horaire: 0, temps_prevu: 0, unite: 'heures' }
      state.calculMO = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(calculerMO.fulfilled, (state, action) => {
        state.calculMO = action.payload
      })
      .addCase(fetchHistorique.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchHistorique.fulfilled, (state, action) => {
        state.loading = false
        state.historique = action.payload
      })
      .addCase(fetchHistorique.rejected, (state) => {
        state.loading = false
      })
      .addCase(fetchSalariesProfils.fulfilled, (state, action) => {
        state.salariesProfils = action.payload
      })
      .addCase(saveChantier.fulfilled, (state, action) => {
        state.historique.unshift(action.payload)
      })
  },
})

export const {
  setMetier, setDirigeant, setCoefficientCharges,
  addSalarie, updateSalarie, removeSalarie,
  setSliderValue, resetChantier,
} = chantierSlice.actions
export default chantierSlice.reducer
