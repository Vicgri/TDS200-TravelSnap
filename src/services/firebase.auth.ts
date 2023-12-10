import { auth } from "@/main";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    signInWithPopup,
    GoogleAuthProvider
} from "firebase/auth"

export const authService = {
    async signUp(email: string, password: string) {
        const userCredential = await createUserWithEmailAndPassword(getAuth(), email, password)
        return userCredential?.user;
    },
    async login(email: string, password: string) {
        const userCredential = await signInWithEmailAndPassword(getAuth(), email, password)
        return userCredential?.user;
    },
    async logout() {
        return await signOut(getAuth());
    },
    async currentUser() {
        return getAuth().currentUser
    },
    async signinWithGoogle() {
        const provider = new GoogleAuthProvider();                                    // Create a GoogleAuthProvider instance
        try {
            const result = await signInWithPopup(getAuth(), provider);                    // Sign in with Google using popup
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;                                      // Get the Google access token
            const user = result.user;                                                             // Get the user object
            return user;                                                                                // Return the user object
        } catch (error) {
            console.error("Error during Google Sign-In:", error);
            return null;        // Return null or throw the error based on error handling strategy
        }
    }
}


