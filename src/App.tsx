import { useEffect } from "react";
import { BrandHeader } from "./components/BrandHeader";
import { DownloadSection, ReleaseDownloadSection } from "./components/DownloadSection";
import { Hero } from "./components/Hero";
import { Highlights } from "./components/Highlights";
import { ProductShots } from "./components/ProductShots";
import { SiteFooter } from "./components/SiteFooter";
import { Workflow } from "./components/Workflow";
import { initializeAnalytics } from "./lib/analytics";

export function App() {
  useEffect(() => {
    initializeAnalytics();
  }, []);
  return (
    <>
      <BrandHeader />
      <main>
        <Hero />
        <ProductShots />
        <Workflow />
        <Highlights />
        {import.meta.env.VITE_RELEASE_DOWNLOADS_ENABLED === "true" ? <ReleaseDownloadSection /> : <DownloadSection />}
      </main>
      <SiteFooter />
    </>
  );
}
