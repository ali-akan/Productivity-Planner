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
  // Destructure email and password from the object
  return createUserWithEmailAndPassword(firebaseAuth, email, password);
};

export const authSignInWith = async ({ email, password }) => {
  return signInWithEmailAndPassword(firebaseAuth, email, password);
};

export const authSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(firebaseAuth, provider);

  // save the user infos in filestore  result.user
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
  return updatePassword(firebaseAuth.userToken, password);
};

///email verification part

export const authSendEmailVerification = () => {
  return sendEmailVerification(firebaseAuth.userToken, {
    url: `${window.location.origin}/home`,
  });
};
