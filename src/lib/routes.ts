// Route to breadcrumb label mapping
export const routeToBreadcrumb: Record<string, string> = {
  "/": "Home",
  "/home": "Home",
  "/products": "Products",
  "/products/:id": "Product Details",
  "/products/proposals": "Proposals",
  "/products/changes": "Changes",
  "/products/purchase-orders": "Purchase Orders",
  "/crm": "CRM",
  "/crm/leads": "Leads",
  "/crm/leads/:id": "Lead Details",
  "/crm/brands": "Brands",
  "/crm/brands/:id": "Brand Details",
  "/crm/forms": "Forms",
  "/messaging": "Messaging",
  "/messaging/inbox": "Inbox",
  "/messaging/inbox/:id": "Thread Details",
  "/messaging/response-templates": "Response Templates",
  "/documents": "Documents",
  "/documents/contracts": "Contracts",
  "/documents/invoices": "Invoices",
  "/documents/receivables": "Receivables",
  "/documents/qa": "QA",
  "/profile": "Profile",
};

// Convert route path to breadcrumb array
export const getBreadcrumbsFromPath = (pathname: string): Array<{ label: string; path: string }> => {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: Array<{ label: string; path: string }> = [];

  // Always start with Home
  breadcrumbs.push({ label: "Home", path: "/" });

  // Build breadcrumbs from path segments
  let currentPath = "";
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;

    // Check if segment looks like an ID (UUID, numeric, or long alphanumeric)
    const isId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment) ||
      /^\d+$/.test(segment) ||
      (segment.length > 10 && /^[a-z0-9-]+$/i.test(segment));

    if (isId) {
      // For dynamic routes (IDs), use the parent path pattern
      const parentPath = i > 0 ? `/${segments[i - 1]}` : "";
      const patternPath = `${parentPath}/:id`;
      const label = routeToBreadcrumb[patternPath] || "Details";
      breadcrumbs.push({ label, path: currentPath });
    } else {
      // Format label: capitalize and replace hyphens with spaces
      const label = routeToBreadcrumb[currentPath] ||
        segment.split("-").map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(" ");
      breadcrumbs.push({ label, path: currentPath });
    }
  }

  return breadcrumbs;
};


