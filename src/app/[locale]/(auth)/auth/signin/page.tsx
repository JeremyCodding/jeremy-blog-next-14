import { SignIn } from "@/components/pages/auth/Signin";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Faça seu Login.'
}

const SignInPage = () => (
    <SignIn />
)

export default SignInPage