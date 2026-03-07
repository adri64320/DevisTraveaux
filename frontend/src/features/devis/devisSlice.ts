import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { devisApi, LigneDevis } from '../../services/api'

interface DevisState {
  lignes: LigneDevis[]
  loading: boolean
  loadingPrix: boolean
  error: string | null
}

const initialState: DevisState = {
  lignes: [],
  loading: false,
  loadingPrix: false,
  error: null,
}

export const uploadDevis = createAsyncThunk(
  'devis/upload',
  async (file: File, { rejectWithValue }) => {
    try {
      const response = await devisApi.upload(file)
      return response.data.lignes
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Erreur lors de l\'upload')
    }
  }
)

export const estimerPrix = createAsyncThunk(
  'devis/estimerPrix',
  async (lignes: LigneDevis[], { rejectWithValue }) => {
    try {
      const response = await devisApi.estimerPrix(lignes)
      return response.data.lignes
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Erreur lors de l\'estimation')
    }
  }
)

const devisSlice = createSlice({
  name: 'devis',
  initialState,
  reducers: {
    updateLigneType(state, action: PayloadAction<{ id: string; type: LigneDevis['type'] }>) {
      const ligne = state.lignes.find(l => l.id === action.payload.id)
      if (ligne) ligne.type = action.payload.type
    },
    updateLignePrix(state, action: PayloadAction<{ id: string; prix: number }>) {
      const ligne = state.lignes.find(l => l.id === action.payload.id)
      if (ligne) ligne.prix_unitaire_estime = action.payload.prix
    },
    validateMixte(state, action: PayloadAction<{ id: string; prix: number }>) {
      const ligne = state.lignes.find(l => l.id === action.payload.id)
      if (ligne) {
        ligne.mixte_valide = true
        ligne.prix_unitaire_estime = action.payload.prix
      }
    },
    resetDevis(state) {
      state.lignes = []
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadDevis.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(uploadDevis.fulfilled, (state, action) => {
        state.loading = false
        state.lignes = action.payload
      })
      .addCase(uploadDevis.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(estimerPrix.pending, (state) => {
        state.loadingPrix = true
      })
      .addCase(estimerPrix.fulfilled, (state, action) => {
        state.loadingPrix = false
        state.lignes = action.payload
      })
      .addCase(estimerPrix.rejected, (state, action) => {
        state.loadingPrix = false
        state.error = action.payload as string
      })
  },
})

export const { updateLigneType, updateLignePrix, validateMixte, resetDevis } = devisSlice.actions
export default devisSlice.reducer
