import { configureStore } from '@reduxjs/toolkit'
import devisReducer from '../features/devis/devisSlice'
import chantierReducer from '../features/chantier/chantierSlice'
import authReducer from '../features/auth/authSlice'

export const store = configureStore({
  reducer: {
    devis: devisReducer,
    chantier: chantierReducer,
    auth: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
