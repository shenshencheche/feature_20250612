import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import StatisticsPage from "@/pages/StatisticsPage";
import ExportPage from "@/pages/ExportPage";
import { createContext, useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { toast } from "sonner";

export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (value: boolean) => {},
  logout: () => {},
});

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const logout = () => {
    setIsAuthenticated(false);
  };

  const showInstallPrompt = () => {
    if (window.pwaInstallEvent) {
      window.pwaInstallEvent.prompt();
      window.pwaInstallEvent.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          toast.success('应用已添加到主屏幕');
        }
      });
    } else {
      toast.info('请在浏览器菜单中选择"添加到主屏幕"');
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout }}
    >
      {isMobile && (
        <button 
          onClick={showInstallPrompt}
          className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg z-50"
        >
          <i className="fa-solid fa-download text-xl"></i>
        </button>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/tracking" element={<div className="flex h-screen bg-gray-50">
          <Navigation />
          <main className="flex-1 overflow-auto p-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">整改追踪</h2>
              <p>整改追踪页面内容</p>
            </div>
          </main>
        </div>} />
        <Route path="/export" element={<ExportPage />} />
      </Routes>
    </AuthContext.Provider>
  );
}
