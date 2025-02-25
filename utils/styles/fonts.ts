// utils/styles/fonts.ts
import localFont from "next/font/local";
import { Inter } from "next/font/google";


// Only configure Inter for now to isolate the issue
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const nikosh = localFont({
  preload: true,
  variable: "--font-nikosh",
  display: "swap",
  src: [
    {
      path: '../../app/styles/fonts/Nikosh/Nikosh_400.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../app/styles/fonts/Nikosh/NikoshLight_300.ttf',
      weight: '300',
      style: 'normal',
    }
  ],
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Arial', 'sans-serif']
});