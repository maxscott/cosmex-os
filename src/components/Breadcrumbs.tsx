import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  if (items.length === 0) return null;

  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center gap-2">
            {index > 0 && <ChevronRight className="w-4 h-4" />}
            {isLast || !item.path ? (
              <span className={isLast ? "text-gray-900 font-medium" : ""}>
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="hover:text-gray-900 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

