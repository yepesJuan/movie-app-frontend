"use client";
import { Montserrat } from "next/font/google";
import { Amplify } from "aws-amplify";
import { Authenticator, ThemeProvider } from "@aws-amplify/ui-react";
import { ApolloProvider } from "@apollo/client";
import { authStyles, formFields } from "./authCustomization";
import Footer from "./components/Footer";
import { client } from "@/lib/apolloClient";
import "@aws-amplify/ui-react/styles.css";
import "./global.css";
import Head from "next/head";
import { amplifyConfig } from "@/lib/config";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
});

Amplify.configure(amplifyConfig);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/public/favicon.ico" />
      </Head>
      <body className={montserrat.className}>
        <style>{`
          ${authStyles}
        `}</style>
        <ThemeProvider>
          <ApolloProvider client={client}>
            <div className="flex flex-col min-h-screen bg-[#093545]">
              <main className="flex-grow flex flex-1 justify-center">
                <Authenticator formFields={formFields}>
                  {children}
                </Authenticator>
              </main>
              <Footer />
            </div>
          </ApolloProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
