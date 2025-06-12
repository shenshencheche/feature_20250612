import { Navigation } from "@/components/Navigation";
import { QualityInspectionForm } from "@/components/QualityInspectionForm";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function Home() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div className="flex h-screen bg-gray-50">
      {!isMobile && <Navigation />}
      <main className={`flex-1 overflow-auto p-6 ${isMobile ? 'pb-20' : ''}`}>
        <QualityInspectionForm />
      </main>
      {isMobile && <Navigation />}
    </div>
  );
}