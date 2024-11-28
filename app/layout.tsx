import Providers from "app/providers";
import { getServerSession } from "next-auth/next";
import dynamic from "next/dynamic";
import React from "react";
import { authOptions } from "utils/lib/auth";
import { inter, nikosh } from "utils/styles/fonts";
import "./styles/scss/globals.scss";

const { healthCard, template } = {
  healthCard: {
    health_id: '98000911712',
    nameBn: 'মোঃ সাজেদুল ইসলাম',
    address: 'মুশুরিয়া, এলাসিন, দেলদুয়ার, টাঙ্গাইল, ঢাকা',
    dob: '05/06/1993',
    genderBn: 'পুরুষ',
    fatherNameBn: 'মোঃ শামছুল হক',
    motherNameBn: 'নাজমা বেগম',
    bloodGroup: '',
    dateProvided: '22/10/2023',
    qrCode: null,
    barCode: null
  },
  template: "/img/templates/nid_temp.png"
};


const Navbar = dynamic(() => import("@components/globals/Navbar"), {
  ssr: true,
});

const Footer = dynamic(() => import("@components/globals/Footer"), {
  ssr: false,
});

export const metadata = {
  icons: {
    icon: "/img/favicon.png",
  },
};

function JSXChildItems({
  children,
}: {
  children: React.ReactNode;
}) {
  return <><Navbar />
    <div className="app-wrapper">{children}</div>
  </>;
}
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" className={`${inter.className}`}>
      <body className="light">
        <span className={nikosh.className}></span>
        <Providers session={session ?? null}>
          <JSXChildItems>{children}</JSXChildItems>
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
