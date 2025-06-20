import { VerifyEmail } from "@/components/pages/auth/VerifyEmail";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Verifique a caixa de entrada de seu email.'
}

const VerifyEmailPage = () => (
    <VerifyEmail />
)

export default VerifyEmailPage