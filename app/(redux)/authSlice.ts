import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser } from "@/app/(services)/api/api"; // Import loginUser API function

// Function to load user from AsyncStorage
const loadUserFromStorage = async (): Promise<any | null> => {
  try {
    const userInfo = await AsyncStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error("Failed to load user info", error);
    return null;
  }
};

// AsyncThunk to load user from AsyncStorage when the app starts
export const loadUser = createAsyncThunk("auth/loadUser", async (_, { rejectWithValue }) => {
  try {
    const user = await loadUserFromStorage();
    return user;
  } catch (error) {
    console.error("Error loading user:", error);
    return rejectWithValue("Error loading user");
  }
});

// AsyncThunk to login user
export const login = createAsyncThunk("auth/login", async (loginData: { phoneNumber: string; password: string }, { rejectWithValue }) => {
  try {
    const response = await loginUser(loginData);
    // Save user to AsyncStorage
    await AsyncStorage.setItem("userInfo", JSON.stringify(response));
    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return rejectWithValue("Login failed");
  }
});

interface AuthState {
  user: any | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginAction: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      state.loading = false;
      AsyncStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logoutAction: (state) => {
      state.user = null;
      state.loading = false;
      AsyncStorage.removeItem("userInfo");
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadUser.fulfilled, (state, action: PayloadAction<any | null>) => {
      console.log("Login successful, user data:", action.payload); 
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(loadUser.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(login.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const { loginAction, logoutAction, setUser, setLoading } = authSlice.actions;

export default authSlice.reducer;
