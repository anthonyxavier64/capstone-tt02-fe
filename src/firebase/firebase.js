import firebase from "firebase/compat/app";
import { getStorage } from "firebase/storage";

import { environment } from "../environments/environment";

const firebaseConfig = environment.firebase;

firebase.initializeApp(firebaseConfig);

export const firebaseStorage = getStorage(firebase);
