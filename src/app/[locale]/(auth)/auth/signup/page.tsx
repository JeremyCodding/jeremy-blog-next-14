import { SignUp } from "@/components/pages/auth/Signup";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Crie sua conta.'
}

const SignUpPage = () => (
    <SignUp />
)

export default SignUpPage