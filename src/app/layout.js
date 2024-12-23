import localFont from "next/font/local";
import "./globals.css";
import "./page.css";


export const metadata = {
  title: "SYONIT",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
