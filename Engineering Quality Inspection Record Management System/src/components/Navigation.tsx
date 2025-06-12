import { NavLink } from "react-router-dom";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function Navigation() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <nav className="flex justify-around py-2">
          <NavLink 
            to="/" 
            className={({isActive}) => 
              `flex flex-col items-center p-2 ${isActive ? 'text-blue-600' : 'text-gray-600'}`
            }
          >
            <i className="fa-solid fa-clipboard-check text-xl"></i>
            <span className="text-xs mt-1">质检记录</span>
          </NavLink>
          <NavLink 
            to="/statistics" 
            className={({isActive}) => 
              `flex flex-col items-center p-2 ${isActive ? 'text-blue-600' : 'text-gray-600'}`
            }
          >
            <i className="fa-solid fa-chart-line text-xl"></i>
            <span className="text-xs mt-1">数据统计</span>
          </NavLink>
          <NavLink 
            to="/tracking" 
            className={({isActive}) => 
              `flex flex-col items-center p-2 ${isActive ? 'text-blue-600' : 'text-gray-600'}`
            }
          >
            <i className="fa-solid fa-list-check text-xl"></i>
            <span className="text-xs mt-1">整改追踪</span>
          </NavLink>
          <NavLink 
            to="/export" 
            className={({isActive}) => 
              `flex flex-col items-center p-2 ${isActive ? 'text-blue-600' : 'text-gray-600'}`
            }
          >
            <i className="fa-solid fa-file-export text-xl"></i>
            <span className="text-xs mt-1">报告导出</span>
          </NavLink>
        </nav>
      </div>
    );
  }

  return (
    <div className="w-64 bg-gray-50 h-screen p-4 border-r border-gray-200">
      <h2 className="text-xl font-semibold text-gray-700 mb-6">工程质检系统</h2>
      <nav className="space-y-2">
        <NavLink 
          to="/" 
          className={({isActive}) => 
            `block px-4 py-2 rounded-md ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`
          }
        >
          <i className="fa-solid fa-clipboard-check mr-2"></i>
          质检记录
        </NavLink>
        <NavLink 
          to="/statistics" 
          className={({isActive}) => 
            `block px-4 py-2 rounded-md ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`
          }
        >
          <i className="fa-solid fa-chart-line mr-2"></i>
          数据统计
        </NavLink>
        <NavLink 
          to="/tracking" 
          className={({isActive}) => 
            `block px-4 py-2 rounded-md ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`
          }
        >
          <i className="fa-solid fa-list-check mr-2"></i>
          整改追踪
        </NavLink>
        <NavLink 
          to="/export" 
          className={({isActive}) => 
            `block px-4 py-2 rounded-md ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`
          }
        >
          <i className="fa-solid fa-file-export mr-2"></i>
          报告导出
        </NavLink>
      </nav>
    </div>
  );
}