import { useState, useMemo } from "react";
import { Navigation } from "@/components/Navigation";
import { toast } from "sonner";

// Mock数据 - 问题整改列表
const issuesData = [
  {
    id: "1",
    name: "材料强度不足",
    startDate: "2025-05-01",
    endDate: "2025-05-10",
    status: "completed"
  },
  {
    id: "2",
    name: "焊接工艺缺陷",
    startDate: "2025-05-15",
    endDate: "2025-05-25",
    status: "in_progress"
  },
  {
    id: "3",
    name: "设计尺寸偏差",
    startDate: "2025-06-01",
    endDate: "2025-06-15",
    status: "not_started"
  },
];

// 日期处理函数
const parseDate = (dateStr: string) => new Date(dateStr);
const formatDate = (date: Date) => date.toISOString().split('T')[0];

// 获取日期范围
const getDateRange = (issues: typeof issuesData) => {
  const dates = issues.flatMap(issue => [parseDate(issue.startDate), parseDate(issue.endDate)]);
  const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
  return { minDate, maxDate };
};

// 状态颜色映射
const statusColors = {
  not_started: "bg-red-500",
  in_progress: "bg-yellow-500",
  completed: "bg-green-500"
};

export default function TrackingPage() {
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{start: Date; end: Date}>(() => {
    const { minDate, maxDate } = getDateRange(issuesData);
    return {
      start: new Date(minDate),
      end: new Date(maxDate)
    };
  });

  // 计算时间轴天数
  const days = useMemo(() => {
    const days = [];
    const currentDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    
    while (currentDate <= endDate) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  }, [dateRange]);

  // 处理日期范围缩放
  const zoomDateRange = (factor: number) => {
    const rangeLength = dateRange.end.getTime() - dateRange.start.getTime();
    const newRangeLength = rangeLength * factor;
    
    const center = dateRange.start.getTime() + rangeLength / 2;
    const newStart = new Date(center - newRangeLength / 2);
    const newEnd = new Date(center + newRangeLength / 2);
    
    setDateRange({ start: newStart, end: newEnd });
  };

  // 处理问题点击
  const handleIssueClick = (issueId: string) => {
    setSelectedIssue(issueId);
    const issue = issuesData.find(i => i.id === issueId);
    if (issue) {
      toast.info(`查看问题: ${issue.name}`);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">整改追踪</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => zoomDateRange(0.8)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                <i className="fa-solid fa-magnifying-glass-plus mr-1"></i>
              </button>
              <button 
                onClick={() => zoomDateRange(1.2)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                <i className="fa-solid fa-magnifying-glass-minus mr-1"></i>
              </button>
              <button 
                onClick={() => {
                  const { minDate, maxDate } = getDateRange(issuesData);
                  setDateRange({ start: new Date(minDate), end: new Date(maxDate) });
                }}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                <i className="fa-solid fa-arrows-to-dot mr-1"></i>重置
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* 时间轴 */}
              <div className="flex border-b border-gray-200">
                <div className="w-48 font-medium text-gray-500 p-2">问题名称</div>
                {days.map((day, index) => (
                  <div 
                    key={index} 
                    className={`w-16 text-xs text-center p-2 ${day.getDay() === 0 || day.getDay() === 6 ? 'bg-gray-50' : ''}`}
                  >
                    {day.getDate()}/{day.getMonth() + 1}
                  </div>
                ))}
              </div>

              {/* 问题列表 */}
              {issuesData.map(issue => {
                const startDate = parseDate(issue.startDate);
                const endDate = parseDate(issue.endDate);
                const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                const startOffset = Math.ceil((startDate.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <div 
                    key={issue.id} 
                    className="flex border-b border-gray-200 hover:bg-blue-50 cursor-pointer"
                    onClick={() => handleIssueClick(issue.id)}
                  >
                    <div className="w-48 font-medium p-2">{issue.name}</div>
                    <div className="flex-1 relative h-10">
                      <div 
                        className={`absolute h-8 rounded-md ${statusColors[issue.status as keyof typeof statusColors]} ${selectedIssue === issue.id ? 'ring-2 ring-blue-500' : ''}`}
                        style={{
                          left: `${startOffset * 100 / days.length}%`,
                          width: `${durationDays * 100 / days.length}%`,
                          top: '50%',
                          transform: 'translateY(-50%)'
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 详情面板 */}
          {selectedIssue && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">问题详情</h3>
              <div className="grid grid-cols-2 gap-4">
                {issuesData
                  .filter(issue => issue.id === selectedIssue)
                  .map(issue => (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">问题名称</p>
                        <p className="font-medium">{issue.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">状态</p>
                        <p className="font-medium capitalize">{issue.status.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">开始日期</p>
                        <p className="font-medium">{issue.startDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">结束日期</p>
                        <p className="font-medium">{issue.endDate}</p>
                      </div>
                    </>
                  ))
                }
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
