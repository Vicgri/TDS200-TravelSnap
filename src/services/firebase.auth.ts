import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
} from "firebase/auth"

export const authService = {
    async signUp (email: string, password: string) {
        const userCredential = await createUserWithEmailAndPassword(getAuth(), email, password)
        return userCredential?.user;
    },
    async login (email: string, password: string) {
        const  userCredential = await  signInWithEmailAndPassword(getAuth(), email, password)
            return userCredential?.user;
    },
    async logout() {
        return await signOut(getAuth());
    },
    async currentUser() {
        return getAuth().currentUser
    }
}


