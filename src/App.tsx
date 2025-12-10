import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Home,
  Package,
  FileText,
  GitBranch,
  ShoppingCart,
  Building2,
  UserPlus,
  Users,
  MessageSquare,
  Inbox,
  Folder,
  Receipt,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import { Sidebar, type NavItem } from "./components/Sidebar";
import { Header } from "./components/Header";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { HomePage } from "./pages/HomePage";
import { ProductsPage } from "./pages/ProductsPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { ProposalsPage } from "./pages/ProposalsPage";
import { ChangesPage } from "./pages/ChangesPage";
import { PurchaseOrdersPage } from "./pages/PurchaseOrdersPage";
import { LeadsPage } from "./pages/LeadsPage";
import { LeadDetailPage } from "./pages/LeadDetailPage";
import { BrandsPage } from "./pages/BrandsPage";
import { BrandDetailPage } from "./pages/BrandDetailPage";
import { CrmFormsPage } from "./pages/CrmFormsPage";
import { FormEditorPage } from "./pages/FormEditorPage";
import { InboxPage } from "./pages/InboxPage";
import { ThreadDetailPage } from "./pages/ThreadDetailPage";
import { ResponseTemplatesPage } from "./pages/ResponseTemplatesPage";
import { ContractsPage } from "./pages/ContractsPage";
import { InvoicesPage } from "./pages/InvoicesPage";
import { ReceivablesPage } from "./pages/ReceivablesPage";
import { QAPage } from "./pages/QAPage";
import { AuthCallbackPage } from "./pages/AuthCallbackPage";
import { AuthProvider } from "./contexts/AuthProvider";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems: NavItem[] = [
    { icon: Home, label: "Home", path: "/" },
    {
      icon: Package,
      label: "Products",
      path: "/products",
      children: [
        { icon: FileText, label: "Proposals", path: "/products/proposals" },
        { icon: GitBranch, label: "Changes", path: "/products/changes" },
        { icon: ShoppingCart, label: "Purchase Orders", path: "/products/purchase-orders" },
      ],
    },
    {
      icon: Building2,
      label: "CRM",
      path: "/crm",
      children: [
        { icon: UserPlus, label: "Leads", path: "/crm/leads" },
        { icon: Users, label: "Brands", path: "/crm/brands" },
        { icon: FileText, label: "Forms", path: "/crm/forms" },
      ],
    },
    {
      icon: MessageSquare,
      label: "Messaging",
      path: "/messaging",
      children: [
        { icon: Inbox, label: "Inbox", path: "/messaging/inbox" },
        { icon: FileText, label: "Response Templates", path: "/messaging/response-templates" },
      ],
    },
    {
      icon: Folder,
      label: "Documents",
      path: "/documents",
      children: [
        { icon: FileText, label: "Contracts", path: "/documents/contracts" },
        { icon: Receipt, label: "Invoices", path: "/documents/invoices" },
        { icon: DollarSign, label: "Receivables", path: "/documents/receivables" },
        { icon: CheckCircle, label: "QA", path: "/documents/qa" },
      ],
    },
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="flex h-screen bg-gray-50">
            <Sidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              navItems={navItems}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header onMenuClick={() => setSidebarOpen(true)} />

              {/* Content Area */}
              <main className="flex-1 overflow-auto p-4 lg:p-6">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/auth/callback" element={<AuthCallbackPage />} />
                  <Route path="/auth/login" element={<LoginPage />} />

                  {/* Protected Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/home" element={<Navigate to="/" replace />} />

                    {/* Products Routes */}
                    <Route path="/products/proposals" element={<ProposalsPage />} />
                    <Route path="/products/changes" element={<ChangesPage />} />
                    <Route path="/products/purchase-orders" element={<PurchaseOrdersPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/products" element={<ProductsPage />} />

                    {/* CRM Routes */}
                    <Route path="/crm/leads/:id" element={<LeadDetailPage />} />
                    <Route path="/crm/leads" element={<LeadsPage />} />
                    <Route path="/crm/brands/:id" element={<BrandDetailPage />} />
                    <Route path="/crm/brands" element={<BrandsPage />} />
                    <Route path="/crm/forms/new" element={<FormEditorPage />} />
                    <Route path="/crm/forms" element={<CrmFormsPage />} />

                    {/* Messaging Routes */}
                    <Route path="/messaging/inbox/:id" element={<ThreadDetailPage />} />
                    <Route path="/messaging/inbox" element={<InboxPage />} />
                    <Route path="/messaging/response-templates" element={<ResponseTemplatesPage />} />

                    {/* Documents Routes */}
                    <Route path="/documents/contracts" element={<ContractsPage />} />
                    <Route path="/documents/invoices" element={<InvoicesPage />} />
                    <Route path="/documents/receivables" element={<ReceivablesPage />} />
                    <Route path="/documents/qa" element={<QAPage />} />

                    {/* Profile Route */}
                    <Route path="/profile" element={<ProfilePage />} />
                  </Route>
                </Routes>
              </main>
            </div>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
