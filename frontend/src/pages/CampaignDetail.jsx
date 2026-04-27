import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProgressBar from '../components/ProgressBar';
import DonorList from '../components/DonorList';
import BlockchainLedger from '../components/BlockchainLedger';
import toast from 'react-hot-toast';
import { format, isPast } from 'date-fns';
import { Clock, Users, Target, ArrowLeft } from 'lucide-react';

const CampaignDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [campaignData, setCampaignData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donateAmount, setDonateAmount] = useState('');
  const [isDonating, setIsDonating] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const res = await api.get(`/campaigns/${id}`);
      setCampaignData(res.data.data);
    } catch (error) {
      toast.error('Failed to load campaign details');
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!donateAmount || Number(donateAmount) <= 0) return;

    setIsDonating(true);
    try {
      await api.post(`/donations/donate/${id}`, { amount: donateAmount });
      toast.success('Donation successful!');
      setShowDonateModal(false);
      setDonateAmount('');
      fetchCampaign(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Donation failed');
    } finally {
      setIsDonating(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">Loading campaign details...</div>;
  }

  if (!campaignData) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">Campaign not found</div>;
  }

  const { campaign, donations } = campaignData;
  const isExpired = isPast(new Date(campaign.deadline));
  const canDonate = user?.role === 'donor' && campaign.status === 'active' && !isExpired && user.id !== campaign.creator._id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-primary transition-colors mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to campaigns
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                campaign.status === 'active' ? 'bg-blue-100 text-blue-800' :
                campaign.status === 'funded' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {campaign.status.toUpperCase()}
              </span>
              <span className="flex items-center text-sm font-medium text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {isExpired ? 'Ended' : `Ends on ${format(new Date(campaign.deadline), 'dd MMM yyyy')}`}
              </span>
            </div>

            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">{campaign.title}</h1>
            
            <div className="flex items-center text-sm text-gray-600 mb-8 pb-8 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold mr-3">
                {campaign.creator?.name?.charAt(0).toUpperCase() || 'C'}
              </div>
              <div>
                <p className="text-gray-500">Created by</p>
                <p className="font-bold text-gray-900">{campaign.creator?.name}</p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-4">About this campaign</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{campaign.description}</p>
          </div>

          <BlockchainLedger donations={donations} />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm sticky top-24">
            <div className="mb-6">
              <ProgressBar raised={campaign.raisedAmount} goal={campaign.goalAmount} status={campaign.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-xl text-center">
                <Target className="w-6 h-6 mx-auto text-primary mb-2" />
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Goal</p>
                <p className="text-lg font-bold text-gray-900">₹{campaign.goalAmount.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl text-center">
                <Users className="w-6 h-6 mx-auto text-primary mb-2" />
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Donors</p>
                <p className="text-lg font-bold text-gray-900">{donations.length}</p>
              </div>
            </div>

            {canDonate ? (
              <button
                onClick={() => setShowDonateModal(true)}
                className="w-full py-4 rounded-xl font-bold text-white bg-primary hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
              >
                Back this project
              </button>
            ) : (
              <div className="bg-gray-50 p-4 rounded-xl text-center text-sm font-medium text-gray-600">
                {user?.role === 'creator' ? 'Creators cannot donate to campaigns.' : 
                 user?.id === campaign.creator._id ? 'You cannot donate to your own campaign.' :
                 campaign.status !== 'active' ? `This campaign is ${campaign.status}.` :
                 isExpired ? 'This campaign has ended.' : 'Please log in as a donor to contribute.'}
              </div>
            )}
          </div>

          <DonorList donations={donations} />
        </div>
      </div>

      {showDonateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Make a Donation</h3>
            <p className="text-gray-500 mb-6 font-medium">You are supporting <strong>{campaign.title}</strong>.</p>
            
            <form onSubmit={handleDonate}>
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Amount (₹)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 font-medium">₹</span>
                  <input
                    type="number"
                    min="1"
                    required
                    value={donateAmount}
                    onChange={(e) => setDonateAmount(e.target.value)}
                    className="pl-8 block w-full border border-gray-300 rounded-xl py-3 focus:ring-2 focus:ring-primary focus:border-primary text-lg font-bold"
                    placeholder="1000"
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDonateModal(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDonating}
                  className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white bg-primary hover:bg-blue-700 transition-colors shadow-md shadow-blue-200 disabled:opacity-50"
                >
                  {isDonating ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetail;
