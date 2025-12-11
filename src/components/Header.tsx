import { useLocation } from "react-router-dom";
import { Menu, Search, Plus } from "lucide-react";
import { Breadcrumbs } from "./Breadcrumbs";
import { getBreadcrumbsFromPath } from "../lib/routes";
import { useOrganizations } from "@/contexts/useOrganizations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onMenuClick: () => void;
}

const getInitials = (name: string): string => {
  const words = name.trim().split(/\s+/);
  if (words.length === 0) return "";
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

export const Header = ({ onMenuClick }: HeaderProps) => {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbsFromPath(location.pathname);
  const title = breadcrumbs[breadcrumbs.length - 1]?.label || "Home";
  const { currentOrganization, organizations, setCurrentOrganization, isLoading } = useOrganizations();
  const currentInitials = currentOrganization ? getInitials(currentOrganization.displayName) : "?";

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
          {!isLoading && organizations && organizations.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-colors text-white font-semibold text-sm"
                  aria-label="Select organization"
                >
                  {currentInitials}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                {organizations.map((org) => {
                  const isCurrent = currentOrganization?.id === org.id;
                  return (
                    <DropdownMenuItem
                      key={org.id}
                      onClick={() => setCurrentOrganization(org.id)}
                      className="py-3 px-4"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0 w-full">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs">
                          {getInitials(org.displayName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{org.displayName}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${org.type === "supplier"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                              }`}>
                              {org.type}
                            </span>
                            {isCurrent && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                current
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

