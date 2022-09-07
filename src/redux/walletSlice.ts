import { IUserWallet } from "@/types/pfas";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type WalletState = {
  wallet: IUserWallet | null;
};

const initialState: WalletState = {
  wallet: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWallet: (state, action: PayloadAction<IUserWallet | null>) => {
      state.wallet = action.payload;
    },
  },
});

export const { setWallet } = walletSlice.actions;

export default walletSlice.reducer;
