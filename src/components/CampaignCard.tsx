import type { Campaign } from "../types/campaign";

interface CampaignCardProps {
  campaign: Campaign;
}

export const CampaignCard = ({ campaign }: CampaignCardProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
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
  );
};

