import { useState, useEffect } from 'react';
import api from '../services/api';
import CampaignCard from '../components/CampaignCard';
import toast from 'react-hot-toast';
import { LayoutDashboard } from 'lucide-react';

const Dashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCampaigns();
  }, []);

  const fetchMyCampaigns = async () => {
    try {
      const res = await api.get('/campaigns/my/campaigns');
      setCampaigns(res.data.data);
    } catch (error) {
      toast.error('Failed to load your campaigns');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
          <LayoutDashboard className="h-8 w-8 mr-3 text-primary" />
          My Dashboard
        </h1>
        <p className="text-gray-500 mt-2 font-medium">Manage your active, funded, and past campaigns.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 h-80 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-8"></div>
              <div className="h-2 bg-gray-200 rounded w-full mb-6"></div>
            </div>
          ))}
        </div>
      ) : campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => (
            <div key={campaign._id} className="relative">
              <CampaignCard campaign={campaign} />
              
              {/* Overlay for creator-specific details like fund release status */}
              <div className="absolute -top-3 -right-3">
                {campaign.status === 'funded' && (
                  <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md border-2 border-white">
                    Funds Released
                  </span>
                )}
                {campaign.status === 'failed' && (
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md border-2 border-white">
                    Refund Issued
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 mb-4">
            <LayoutDashboard className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No campaigns yet</h3>
          <p className="text-gray-500 mb-6">You haven't created any campaigns. Start your first one today!</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
