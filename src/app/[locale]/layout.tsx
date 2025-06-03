import type { Metadata } from "next";
import "./globals.css";
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from "next-intl/server";
import { Providers } from "./providers";


export const metadata: Metadata = {
  title: {template: "%s | Jeremy Blog", default: "Home | Jeremy Blog"}
};

export default async function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string}
}>) {
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className={`antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
