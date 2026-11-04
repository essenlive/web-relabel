'use client';
import { ReactNode } from "react";
import Navigation from "@components/Navigation";
import Footer from "@components/Footer";
import { cn } from "@libs/utils";

interface LayoutProps {
  full?: boolean;
  padded?: boolean;
  children?: ReactNode;
  grid?: boolean;
  fullWidth?: boolean;
}

const Layout = ({full, padded, children, grid, fullWidth}: LayoutProps) => {
  return (
    <div className={cn(
      "flex flex-col overflow-x-hidden bg-repeat bg-fixed print:bg-none min-h-screen",
    )} style={{ backgroundImage: "url('/assets/memphis-mini.png')" }}>
      <header className={cn(
        "w-full shrink-0 z-100 print:hidden",
        full && "absolute top-0 left-0 right-0 z-50"
      )}>
        <Navigation />
      </header>

      <main className={cn(
        "flex-1 w-full mx-auto flex flex-col items-center",
        !full && "max-w-270",
        "max-md:w-full",
        padded && "mt-20 mb-8 px-8 pb-16",
        full && "h-screen max-w-full overflow-hidden relative",
        fullWidth && "max-w-full",
        grid && "grid gap-8 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] auto-rows-auto items-stretch",
        "print:!m-0 print:!p-0 print:!w-full print:!h-full"
      )}>
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default Layout
