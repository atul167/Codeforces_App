import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    // This is the default state configuration
    rating: "",
    imageURL: "",
    rank: "",
  },
  reducers: {
    setRating(state, action) {
      state.rating = action.payload;
    },
    setImageURL(state, action) {
      state.imageURL = action.payload;
    },
    setRank(state, action) {
      state.rank = action.payload;
    },
  },
});

export const { setUsername, setRating, setImageURL, setRank, } =
  userSlice.actions;
export default userSlice.reducer;
