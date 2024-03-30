import { firebaseAuth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updatePassword,
} from "firebase/auth";

export const authCreateUser = async ({ email, password }) => {
  return createUserWithEmailAndPassword(firebaseAuth, email, password);
};

export const authSignInWith = async ({ email, password }) => {
  return signInWithEmailAndPassword(firebaseAuth, email, password);
};

export const authSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(firebaseAuth, provider);

  return result;
};

export const authSignOut = () => {
  return firebaseAuth.signOut();
};

/// following part will be added the project, these are extras

export const authPasswordReset = (email) => {
  return sendPasswordResetEmail(firebaseAuth, email);
};

export const authPasswordChange = (password) => {
  return updatePassword(firebaseAuth.userInfo, password);
};

///email verification part

export const authSendEmailVerification = () => {
  return sendEmailVerification(firebaseAuth.userInfo, {
    url: `${window.location.origin}/home`,
  });
};
