import { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, ChevronRight, User, Users } from "lucide-react";

export interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path?: string;
  children?: NavItem[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

export const Sidebar = ({ isOpen, onClose, navItems }: SidebarProps) => {
  const location = useLocation();
  const [manuallyOpenItems, setManuallyOpenItems] = useState<Set<string>>(new Set());

  // Auto-open parent if current route matches a child
  const autoOpenParent = useMemo(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    if (pathSegments.length > 1) {
      return `/${pathSegments[0]}`;
    }
    return null;
  }, [location.pathname]);

  // Combine auto-opened parent with manually toggled items
  const openItems = useMemo(() => {
    const combined = new Set(manuallyOpenItems);
    if (autoOpenParent) {
      combined.add(autoOpenParent);
    }
    return combined;
  }, [manuallyOpenItems, autoOpenParent]);

  const toggleItem = (itemPath: string, e: React.MouseEvent) => {
    e.preventDefault();
    setManuallyOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemPath)) {
        next.delete(itemPath);
      } else {
        next.add(itemPath);
      }
      return next;
    });
  };

  const isRouteActive = (path?: string): boolean => {
    if (!path) return false;
    if (path === "/" || path === "/home") {
      return location.pathname === "/" || location.pathname === "/home";
    }
    return location.pathname.startsWith(path);
  };

  const hasActiveChild = (item: NavItem): boolean => {
    if (!item.children) return false;
    return item.children.some((child) => isRouteActive(child.path));
  };

  const renderNavItem = (item: NavItem, level: number = 0) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const itemPath = item.path || "";
    const isOpen = openItems.has(itemPath);
    const isActive = isRouteActive(item.path) || hasActiveChild(item);

    const content = (
      <>
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 shrink-0" />
          <span>{item.label}</span>
        </div>
        {hasChildren && (
          <div className="shrink-0 transition-transform duration-300 ease-in-out">
            <ChevronRight
              className={`w-4 h-4 transition-transform duration-300 ease-in-out ${isOpen ? "rotate-90" : "rotate-0"
                }`}
            />
          </div>
        )}
      </>
    );

    return (
      <div key={itemPath || item.label}>
        {hasChildren ? (
          <button
            onClick={(e) => toggleItem(itemPath, e)}
            className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg mb-1 transition-colors ${isActive
              ? "bg-gray-100 text-gray-900"
              : "text-gray-600 hover:bg-gray-50"
              }`}
            style={{ paddingLeft: `${12 + level * 16}px` }}
          >
            {content}
          </button>
        ) : (
          <Link
            to={itemPath || "/"}
            onClick={onClose}
            className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg mb-1 transition-colors ${isActive
              ? "bg-gray-100 text-gray-900"
              : "text-gray-600 hover:bg-gray-50"
              }`}
            style={{ paddingLeft: `${12 + level * 16}px` }}
          >
            {content}
          </Link>
        )}
        {hasChildren && (
          <div
            className={`ml-4 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96" : "max-h-0"
              }`}
          >
            <div className="py-1">
              {item.children!.map((child) => renderNavItem(child, level + 1))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-amber-300 saturate-70 rounded-lg"></div>
            <span className="text-xl font-bold">CosmexOS</span>
          </div>
          <button onClick={onClose} className="lg:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 flex flex-col overflow-hidden p-4">
          <div className="flex-1 overflow-y-auto min-h-0">
            {navItems.map((item) => renderNavItem(item))}
          </div>

          {/* Profile Link at Bottom */}
          <div className="mt-auto pt-4 border-t border-gray-200 shrink-0">
            <Link to="/team"
              onClick={onClose}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${location.pathname === "/test"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              <Users className="w-5 h-5 shrink-0" />
              <span>Team</span>
            </Link>
            <Link
              to="/profile"
              onClick={onClose}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${location.pathname === "/profile"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              <User className="w-5 h-5 shrink-0" />
              <span>Profile</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

