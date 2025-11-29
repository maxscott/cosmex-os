import type { Campaign } from "../types/campaign";

interface CampaignTableProps {
  campaigns: Campaign[];
}

export const CampaignTable = ({ campaigns }: CampaignTableProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
  );
};

