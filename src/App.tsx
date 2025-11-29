import { useState } from "react";
import {
  Menu,
  X,
  Search,
  Plus,
  Home,
  Mail,
  FileText,
  RefreshCw,
  Inbox,
  Users,
  FileCheck,
  Settings,
} from "lucide-react";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const campaigns = [
    {
      id: 1,
      icon: "🚀",
      name: "Changelog - 17",
      date: "June 13",
      sends: "23,306",
      opens: "63%",
      clicks: "16%",
      status: "Sent",
    },
    {
      id: 2,
      icon: "🤝",
      name: "Investor update - Q3",
      date: "April 12",
      sends: "32",
      opens: "100%",
      clicks: "24%",
      status: "Draft",
    },
    {
      id: 3,
      icon: "💯",
      name: "NPS survey",
      date: "May 4",
      sends: "600",
      opens: "55%",
      clicks: "32%",
      status: "Draft",
    },
  ];

  const navItems = [
    { icon: Home, label: "Home", active: true },
    { icon: Mail, label: "Templates", active: false },
    { icon: FileText, label: "Campaigns", active: false },
    { icon: Inbox, label: "Transactional", active: false },
    { icon: Users, label: "Audience", active: false },
    { icon: FileCheck, label: "Forms", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-amber-300 saturate-70 rounded-lg"></div>
            <span className="text-xl font-bold">CosmexOS</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4">
          {navItems.map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors ${item.active
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-semibold">Home</h1>
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

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {/* Campaigns Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Campaigns</h2>
              <button className="text-gray-400 hover:text-gray-600">
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Campaign
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Updated
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Sends
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Opens
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Clicks
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600"></th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr
                      key={campaign.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{campaign.icon}</span>
                          <span className="font-medium">{campaign.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {campaign.date}
                      </td>
                      <td className="py-3 px-4 text-gray-900">
                        {campaign.sends}
                      </td>
                      <td className="py-3 px-4 text-gray-900">
                        {campaign.opens}
                      </td>
                      <td className="py-3 px-4 text-gray-900">
                        {campaign.clicks}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${campaign.status === "Sent"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                            }`}
                        >
                          {campaign.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-3 text-sm text-gray-500 border-t border-gray-100">
                12 more
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="bg-white rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{campaign.icon}</span>
                      <div>
                        <div className="font-medium">{campaign.name}</div>
                        <div className="text-sm text-gray-500">
                          {campaign.date}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${campaign.status === "Sent"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {campaign.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Sends</div>
                      <div className="font-medium">{campaign.sends}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Opens</div>
                      <div className="font-medium">{campaign.opens}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Clicks</div>
                      <div className="font-medium">{campaign.clicks}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default App;
