import { Plus } from "lucide-react";
import type { Campaign } from "../types/campaign";
import { CampaignTable } from "./CampaignTable";
import { CampaignCard } from "./CampaignCard";

interface CampaignListProps {
  campaigns: Campaign[];
}

export const CampaignList = ({ campaigns }: CampaignListProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Campaigns</h2>
        <button className="text-gray-400 hover:text-gray-600">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <CampaignTable campaigns={campaigns} />
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
};

