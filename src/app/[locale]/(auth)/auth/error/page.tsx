import { AuthError } from "@/components/pages/auth/Error";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Opa! Algo de errado!'
}

const AuthErrorPage = () => (
    <AuthError />
)

export default AuthErrorPage