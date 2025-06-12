import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { toast } from "sonner";

export default function ExportPage() {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel'>('pdf');
  const [exportRange, setExportRange] = useState<'all' | 'current'>('all');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    toast.info('正在生成报告...');
    
    // 模拟导出过程
    setTimeout(() => {
      setIsExporting(false);
      toast.success(
        `已成功导出${exportRange === 'all' ? '全部' : '当前'}数据为${exportFormat.toUpperCase()}格式`,
        {
          action: {
            label: '查看',
            onClick: () => toast.info('模拟打开文件')
          }
        }
      );
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">报告导出</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">导出设置</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">导出格式</label>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="h-4 w-4 text-blue-600"
                        checked={exportFormat === 'pdf'}
                        onChange={() => setExportFormat('pdf')}
                      />
                      <span className="ml-2 text-gray-700">PDF标准报告</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="h-4 w-4 text-blue-600"
                        checked={exportFormat === 'excel'}
                        onChange={() => setExportFormat('excel')}
                      />
                      <span className="ml-2 text-gray-700">Excel原始数据</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">导出范围</label>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="h-4 w-4 text-blue-600"
                        checked={exportRange === 'all'}
                        onChange={() => setExportRange('all')}
                      />
                      <span className="ml-2 text-gray-700">全部数据</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="h-4 w-4 text-blue-600"
                        checked={exportRange === 'current'}
                        onChange={() => setExportRange('current')}
                      />
                      <span className="ml-2 text-gray-700">当前视图</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className={`px-4 py-2 rounded-md text-white font-medium ${isExporting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
              >
                {isExporting ? (
                  <>
                    <i className="fa-solid fa-spinner animate-spin mr-2"></i>
                    正在导出...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-file-export mr-2"></i>
                    导出报告
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
