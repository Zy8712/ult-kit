import JumpToTopButton from "@/components/shared-components/JumpToTopButton";
import ClientProvider from "./ClientProvider";
import Navbar from "@/components/shared-components/Navbar";
import SideNavLarge from "@/components/shared-components/SideNavLarge";
import SideNavSmall from '@/components/shared-components/SideNavSmall';
import "@/styles/globals.css";
import AIAssistanceButton from "@/components/shared-components/AIAssistanceButton";
import AuthInitializer from "@/components/AuthInitializer";

export const metadata = {
  title: "Ult Kit - The Ultimate Toolkit",
  description: "Ult Kit is a comprehensive digital toolkit offering curated links to over 400 powerful external tools for developers, designers, marketers, and creators. From productivity boosters and design assets to code generators and SEO analyzers, Ult Kit helps you quickly discover and access the best resources on the web—all in one place.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="relative min-h-screen bg-black overflow-x-hidden overflow-y-auto !m-0 !p-0">
        <ClientProvider>
          <main className="w-full h-full min-h-screen !m-0 !p-0">
            <AuthInitializer />
            <Navbar />
            {children}
            <SideNavLarge />
            <SideNavSmall />
          </main>
          <JumpToTopButton />
          <AIAssistanceButton />
        </ClientProvider>
      </body>
    </html>
  );
}
