import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { auth } from "../services/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  async function logout() {
    return signOut(auth);
  }

  async function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  async function getIdToken() {
    if (!user) {
      throw new Error("User is not signed in.");
    }
    return user.getIdToken();
  }

  const value = {
    user,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    getIdToken
  };

  return (
    <AuthContext.Provider value = {value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}