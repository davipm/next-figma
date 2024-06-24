import { Work_Sans } from "next/font/google";
import "./globals.css";

import { ReactNode } from "react";
import { Room } from "@/app/room";
import { TooltipProvider } from "@/components/ui/tooltip";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["400", "600", "700"],
});

export const metadata = {
  title: "Figma Clone",
  description:
    "A minimalist Figma clone using fabric.js and Live blocks for realtime collaboration",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${workSans.className} bg-primary-grey-200`}>
        <Room>
          <TooltipProvider>{children}</TooltipProvider>
        </Room>
      </body>
    </html>
  );
}
