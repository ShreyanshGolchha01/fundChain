import { useState, useEffect } from 'react';
import api from '../services/api';
import CampaignCard from '../components/CampaignCard';
import { Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const Home = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(''); // active, funded, failed, ''
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCampaigns();
  }, [filter, search]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filter) queryParams.append('status', filter);
      if (search) queryParams.append('search', search);

      const res = await api.get(`/campaigns?${queryParams.toString()}`);
      setCampaigns(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch campaigns');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Discover Campaigns</h1>
          <p className="text-gray-500 mt-2 font-medium">Fund the next big idea with our smart blockchain simulator.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="block w-full pl-9 pr-8 py-2.5 border border-gray-300 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none cursor-pointer font-medium text-gray-700"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="funded">Funded</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 h-80 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-8"></div>
              <div className="h-2 bg-gray-200 rounded w-full mb-6"></div>
              <div className="flex justify-between items-center mt-auto">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign._id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-50 mb-6">
            <Search className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No campaigns found</h3>
          <p className="text-gray-500">Try adjusting your filters or search term.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
