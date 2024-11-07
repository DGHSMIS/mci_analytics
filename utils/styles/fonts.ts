import localFont from 'next/font/local';

import { Inter } from "next/font/google";

export const inter = Inter({
  preload:true,
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
  subsets: ["latin-ext"],
});


export const nikosh = localFont({
    preload:true,
    variable: "--font-nikosh",
    display: "swap",
  
    src: [
      {
        path: '../../app/styles/fonts/Nikosh/Nikosh_400.ttf',
        weight: '400',
        style: 'regular',
      },
      {
        path: '../../app/styles/fonts/Nikosh/NikoshLight_300.ttf',
        weight: '300',
        style: 'light',
      }
    ],
  });