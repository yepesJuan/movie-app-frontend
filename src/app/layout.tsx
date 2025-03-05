"use client";
import awsExports from "@/aws-exports";
import { Amplify } from "aws-amplify";
import { Authenticator, ThemeProvider } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "./global.css";
import { authStyles, formFields } from "./authCustomization";
import Footer from "./components/Footer";

// bg-no-repeat
// bg-bottom
// bg-cover

Amplify.configure(awsExports);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <style jsx global>
          {authStyles}
        </style>
      </head>
      <body
        className="
          min-h-screen 
          flex 
          flex-col
          bg-[#093545] 
        "
      >
        <div className="flex flex-grow items-center justify-center">
          <ThemeProvider>
            <Authenticator formFields={formFields} className="w-full max-w-md">
              {children}
            </Authenticator>
          </ThemeProvider>
        </div>
        <div className="absolute bottom-0 left-0 w-full pointer-events-none z-[-1]">
          <Footer />
        </div>
      </body>
    </html>
  );
}
