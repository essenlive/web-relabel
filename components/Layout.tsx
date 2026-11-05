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
  // Edge-to-edge bands: header, page sections and footer share one set of rules.
  bleed?: boolean;
}

const Layout = ({full, padded, children, grid, fullWidth, bleed}: LayoutProps) => {
  return (
    <div className={cn(
      "flex min-h-screen flex-col overflow-x-hidden bg-white bg-[url('/assets/memphis-tint.png')] bg-repeat print:bg-none",
    )} >
      <header className={cn(
        "w-full shrink-0 z-100 print:hidden",
        full && "absolute top-0 left-0 right-0 z-50",
        bleed && "border-b-4 border-primary bg-white"
      )}>
        <Navigation wide={bleed} />
      </header>

      <main className={cn(
        "flex-1 w-full mx-auto flex flex-col items-center",
        !full && !bleed && "max-w-270",
        bleed && "items-stretch bg-white",
        "max-md:w-full",
        padded && "mt-20 mb-8 px-8 pb-16",
        full && "h-screen max-w-full overflow-hidden relative",
        fullWidth && "max-w-full",
        grid && "grid gap-8 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] auto-rows-auto items-stretch",
        "print:!m-0 print:!p-0 print:!w-full print:!h-full"
      )}>
        {children}
      </main>

      <Footer wide={bleed} />
    </div>
  );
}

export default Layout
