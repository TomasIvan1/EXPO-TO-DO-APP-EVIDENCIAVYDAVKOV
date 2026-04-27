import axios from "axios";

const API_KEY = "AIzaSyA-hA3XoafpkTb04Kms2CrGZMKuSt9LiBo";

export async function createUser(email, password) {
  try {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
      { email, password, returnSecureToken: true }
    );
    return response.data;
  } catch (error) {
    console.log(
      "Error creating user",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

export async function signIn(email, password) {
  try {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
      { email, password, returnSecureToken: true }
    );
    return response.data;
  } catch (error) {
    console.log(
      "Error signing in",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}