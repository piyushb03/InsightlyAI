import { Geist } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "InsightlyAI — Sales Intelligence",
  description: "Upload your sales data and get AI-powered insights instantly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} antialiased`}>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
