import localFont from "next/font/local";
import "./globals.css";
import "./page.css";
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import AudioProvider from "./audioProvider";
import { UserProvider} from "./Context/userContext";
import { TournamentProvider } from "./Context/tournament";
import { SocketProvider } from "./Context/SocketContext";
import { OnboardingProvider } from "./Context/OnboardingContext";
export const metadata = {
  title: "SYONIT",
  description: "SYONIT: the fast-paced Yes or No tournament where the minority wins.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f7712f",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet"/>
<link href="https://fonts.cdnfonts.com/css/helvetica-neue-55" rel="stylesheet"/>
<link rel="preload" as="image" href="/bg2.png" /> {/* Preload your image here */}
  </head>
      <body>
         <UserProvider>
        <SocketProvider>
          <TournamentProvider>
        <AudioProvider>
          <OnboardingProvider>
        <ToastContainer
        toastClassName="custom-toast"
        className="custom-toast-container"
        position="top-center"
        limit={2}
        autoClose={3500}
        newestOnTop
        pauseOnFocusLoss={false}/>
        {children}
        </OnboardingProvider>
        </AudioProvider>
        </TournamentProvider>
        </SocketProvider>
                </UserProvider>
      </body>
    </html>
  );
}
