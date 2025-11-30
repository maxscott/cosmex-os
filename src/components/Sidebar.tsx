import { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, ChevronRight } from "lucide-react";

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

  // Derive which parent should be open based on current route
  const routeBasedOpen = useMemo(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    if (pathSegments.length > 1) {
      return `/${pathSegments[0]}`;
    }
    return null;
  }, [location.pathname]);

  // Track manually toggled items (user clicks) and the route section when it was toggled
  const [manuallyToggled, setManuallyToggled] = useState<string | null>(null);
  const [manuallyToggledRoute, setManuallyToggledRoute] = useState<string | null>(null);

  // Compute effective open items: manual toggle takes precedence if still in same route section
  const openItems = useMemo(() => {
    // If there's a manual toggle and we're still in the same route section, use it
    // This allows clicking to expand different nav sections without changing routes
    if (manuallyToggled !== null && manuallyToggledRoute === routeBasedOpen) {
      return new Set([manuallyToggled]);
    }
    // If route changed to a different section, clear manual toggle state
    if (manuallyToggledRoute !== routeBasedOpen && manuallyToggled !== null) {
      // Clear the manual toggle when route changes (but don't call setState here)
      // We'll handle this by checking the condition above
    }
    // Use route-based if available
    if (routeBasedOpen) {
      return new Set([routeBasedOpen]);
    }
    return new Set();
  }, [manuallyToggled, manuallyToggledRoute, routeBasedOpen]);

  const toggleItem = (itemPath: string, e: React.MouseEvent) => {
    e.preventDefault();
    const currentRouteSection = routeBasedOpen;

    setManuallyToggled((prev) => {
      // If clicking the same item that's already open, close it
      if (prev === itemPath) {
        setManuallyToggledRoute(null);
        return null;
      }
      // Otherwise, open this item (accordion behavior - only one open at a time)
      setManuallyToggledRoute(currentRouteSection);
      return itemPath;
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
            className={`ml-4 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
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
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 overflow-y-auto ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
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

        <nav className="p-4">
          {navItems.map((item) => renderNavItem(item))}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

