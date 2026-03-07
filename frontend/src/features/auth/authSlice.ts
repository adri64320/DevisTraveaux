import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { authApi } from '../../services/api'

interface AuthState {
  isAuthenticated: boolean
  userId: string | null
  email: string | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  userId: null,
  email: null,
  loading: false,
  error: null,
}

export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.register(email, password)
      return response.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Erreur lors de l\'inscription')
    }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.login(email, password)
      return { email }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Email ou mot de passe incorrect')
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  await authApi.logout()
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.userId = action.payload.id
        state.email = action.payload.email
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.email = action.payload.email
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false
        state.userId = null
        state.email = null
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
