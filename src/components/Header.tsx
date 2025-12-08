import { useLocation, Link } from "react-router-dom";
import { Menu, Search, User, Plus } from "lucide-react";
import { Breadcrumbs } from "./Breadcrumbs";
import { getBreadcrumbsFromPath } from "../lib/routes";
import { useAuth } from "../contexts/useAuth";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbsFromPath(location.pathname);
  const title = breadcrumbs[breadcrumbs.length - 1]?.label || "Home";
  const { user } = useAuth();

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
          <button className="flex items-center gap-2 px-2 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
            <Plus className="w-5 h-5" />
          </button>
          <Link
            to="/profile"
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-50 transition-colors"
          >
            {user?.profilePictureUrl ? (
              <img
                src={user.profilePictureUrl}
                alt={user.firstName || user.email || "User"}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-amber-300 saturate-70 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

