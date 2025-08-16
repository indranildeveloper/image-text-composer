import { FC } from "react";
import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import { RootLayoutProps } from "@/interfaces/RootLayoutProps";

import "@/styles/globals.css";

const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Image Text Composer",
  description: "Edit Images and add text to images.",
};

const RootLayout: FC<Readonly<RootLayoutProps>> = ({ children }) => {
  return (
    <html lang="en">
      <body
        className={`${interSans.variable} ${firaCode.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
