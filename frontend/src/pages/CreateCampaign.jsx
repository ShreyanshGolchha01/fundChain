import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Target, AlignLeft, Calendar, HandCoins } from 'lucide-react';

const CreateCampaign = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goalAmount: '',
    deadline: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post('/campaigns', {
        ...formData,
        goalAmount: Number(formData.goalAmount),
      });
      toast.success('Campaign created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Failed to create campaign');
    } finally {
      setIsLoading(false);
    }
  };

  // Get tomorrow's date in YYYY-MM-DD for min attribute
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Start a Campaign</h1>
        <p className="text-gray-500 font-medium mb-8">Share your idea and start raising funds today.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Campaign Title</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Target className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="pl-10 block w-full border border-gray-300 rounded-xl py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-shadow bg-gray-50 focus:bg-white"
                placeholder="e.g. Save the Rainforest"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <AlignLeft className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                name="description"
                required
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="pl-10 block w-full border border-gray-300 rounded-xl py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-shadow bg-gray-50 focus:bg-white resize-none"
                placeholder="Describe your campaign in detail..."
              ></textarea>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Goal Amount (₹)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HandCoins className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="goalAmount"
                  required
                  min="100"
                  value={formData.goalAmount}
                  onChange={handleChange}
                  className="pl-10 block w-full border border-gray-300 rounded-xl py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-shadow bg-gray-50 focus:bg-white"
                  placeholder="e.g. 50000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Deadline</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="deadline"
                  required
                  min={minDate}
                  value={formData.deadline}
                  onChange={handleChange}
                  className="pl-10 block w-full border border-gray-300 rounded-xl py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-shadow bg-gray-50 focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Launch Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;
