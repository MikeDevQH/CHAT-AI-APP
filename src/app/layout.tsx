import "./globals.css";
import ChatHeader from "@/components/header";
import Footer from "@/components/footer";
import { ThemeProvider } from 'next-themes';  
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="bg-[var(--background)]"  
        >
        <ThemeProvider>  
        <div className="fixed top-0 left-0 w-full z-10">
          <ChatHeader />
        </div>
          {children}
        <footer className=" fixed z-10 bottom-0 right-0 text-center ">
          <Footer />
        </footer>
    </ThemeProvider> 
      </body>
    </html>
  );
}
