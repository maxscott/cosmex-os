import { CampaignList } from "../components/CampaignList";
import type { Campaign } from "../types/campaign";

const campaigns: Campaign[] = [
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

export const HomePage = () => {
  return <CampaignList campaigns={campaigns} />;
};


