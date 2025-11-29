import { useState } from "react";
import { Home, Mail, FileText, Inbox, Users, FileCheck, Settings } from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { CampaignList } from "./components/CampaignList";

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
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navItems={navItems}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title="Home"
        />

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <CampaignList campaigns={campaigns} />
        </main>
      </div>
    </div>
  );
};

export default App;
