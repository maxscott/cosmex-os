import { useLocation } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import { Breadcrumbs } from "./Breadcrumbs";
import { getBreadcrumbsFromPath } from "../lib/routes";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbsFromPath(location.pathname);
  const title = breadcrumbs[breadcrumbs.length - 1]?.label || "Home";

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            {breadcrumbs.length > 0 && (
              <Breadcrumbs items={breadcrumbs} />
            )}
            <h1 className="text-2xl font-semibold">{title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="hidden sm:flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <Search className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
            New
          </button>
        </div>
      </div>
    </header>
  );
};

