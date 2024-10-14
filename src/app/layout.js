import "./globals.css";
import { Inter } from 'next/font/google'
import { DarkModeProvider } from '../contexts/DarkModeContext';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Interactive Dashboard",
  description: "A full-stack interactive dashboard application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DarkModeProvider>{children}</DarkModeProvider>
      </body>
    </html>
  );
}