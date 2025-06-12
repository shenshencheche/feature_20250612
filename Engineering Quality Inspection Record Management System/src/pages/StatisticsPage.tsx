import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell, ResponsiveContainer as PieResponsiveContainer, Sector } from "recharts";
import { Navigation } from "@/components/Navigation";
import { toast } from "sonner";

// Mock数据 - 合格率趋势
const passRateData = [
  { date: "2025-01", rate: 92 },
  { date: "2025-02", rate: 95 },
  { date: "2025-03", rate: 89 },
  { date: "2025-04", rate: 93 },
  { date: "2025-05", rate: 96 },
];

// Mock数据 - 问题分布
const issueDistributionData = [
  { type: "材料问题", count: 12, severity: "high" },
  { type: "工艺问题", count: 8, severity: "medium" },
  { type: "设计问题", count: 5, severity: "low" },
];

const COLORS = {
  high: "#ef4444", // red-500
  medium: "#f59e0b", // amber-500
  low: "#10b981", // emerald-500
};

export default function StatisticsPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const handleFullscreen = (chartType: string) => {
    toast.info(`${chartType}图表已进入全屏模式`);
    // 实际项目中这里会实现全屏逻辑
  };

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
    return (
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 overflow-auto p-6 space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">合格率趋势</h2>
            <button
              onClick={() => handleFullscreen("合格率趋势")}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
            >
              <i className="fa-solid fa-expand mr-1"></i>全屏
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={passRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[85, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, "合格率"]} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#1e88e5" // blue-600
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                  name="合格率"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">问题类型分布</h2>
            <button
              onClick={() => handleFullscreen("问题类型分布")}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
            >
              <i className="fa-solid fa-expand mr-1"></i>全屏
            </button>
          </div>
          <div className="h-80">
            <PieResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={issueDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="type"
                  onMouseEnter={onPieEnter}
                >
                  {issueDistributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[entry.severity as keyof typeof COLORS]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    `${value}个`,
                    name,
                    `严重程度: ${props.payload.severity === "high" ? "高" : props.payload.severity === "medium" ? "中" : "低"}`,
                  ]}
                />
                <Legend
                  formatter={(value, entry, index) => {
                    const severity = issueDistributionData[index].severity;
                    return (
                      <span className="flex items-center">
                        <span
                          className="inline-block w-3 h-3 mr-2 rounded-full"
                          style={{
                            backgroundColor: COLORS[severity as keyof typeof COLORS],
                          }}
                        ></span>
                        {value}
                      </span>
                    );
                  }}
                />
              </PieChart>
            </PieResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
