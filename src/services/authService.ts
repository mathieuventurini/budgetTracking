import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from '../config/firebase';

/**
 * Creates a new user account with email and password
 */
export const signUp = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Error signing up:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Signs in an existing user with email and password
 */
export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Signs out the current user
 */
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Observes authentication state changes
 */
export const observeAuthState = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Gets the current authenticated user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Converts Firebase auth error codes to user-friendly messages
 */
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Cet email est déjà utilisé.';
    case 'auth/invalid-email':
      return 'Email invalide.';
    case 'auth/operation-not-allowed':
      return 'Opération non autorisée.';
    case 'auth/weak-password':
      return 'Le mot de passe est trop faible (minimum 6 caractères).';
    case 'auth/user-disabled':
      return 'Ce compte a été désactivé.';
    case 'auth/user-not-found':
      return 'Aucun compte trouvé avec cet email.';
    case 'auth/wrong-password':
      return 'Mot de passe incorrect.';
    case 'auth/too-many-requests':
      return 'Trop de tentatives. Réessayez plus tard.';
    case 'auth/network-request-failed':
      return 'Erreur réseau. Vérifiez votre connexion.';
    default:
      return 'Une erreur est survenue. Veuillez réessayer.';
  }
};
