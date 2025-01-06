import localFont from "next/font/local";
import "./globals.css";
import "./page.css";
import Head from 'next/head';


export const metadata = {
  title: "SYONIT",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet"/>
<link href="https://fonts.cdnfonts.com/css/helvetica-neue-55" rel="stylesheet"/>
  </head>
      <body>
        {children}
      </body>
    </html>
  );
}
