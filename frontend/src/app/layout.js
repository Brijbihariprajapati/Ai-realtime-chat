import { Fraunces, Outfit } from "next/font/google";
import AuthInit from "@/components/AuthInit";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const sans = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Deft — AI Real-Time Chat",
  description:
    "Google OAuth, Socket.IO chat, Gemini AI tools, and Premium unlocks.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable}`}>
        <AuthInit />
        {children}
      </body>
    </html>
  );
}
