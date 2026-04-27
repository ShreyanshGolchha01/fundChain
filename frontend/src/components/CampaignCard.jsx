import { Link } from 'react-router-dom';
import { Clock, TrendingUp } from 'lucide-react';
import { formatDistanceToNow, isPast } from 'date-fns';
import ProgressBar from './ProgressBar';

const CampaignCard = ({ campaign }) => {
  const isExpired = isPast(new Date(campaign.deadline));
  const timeLeft = isExpired ? 'Ended' : formatDistanceToNow(new Date(campaign.deadline), { addSuffix: true });

  const getStatusBadge = () => {
    switch (campaign.status) {
      case 'active':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-medium">Active</span>;
      case 'funded':
        return <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full font-medium">Funded</span>;
      case 'failed':
        return <span className="bg-red-100 text-red-800 text-xs px-2.5 py-0.5 rounded-full font-medium">Failed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-4">
          {getStatusBadge()}
          <div className="flex items-center text-sm text-gray-500 font-medium">
            <Clock className="w-4 h-4 mr-1" />
            {timeLeft}
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{campaign.title}</h3>
        <p className="text-gray-500 text-sm mb-6 line-clamp-3 flex-grow">{campaign.description}</p>

        <div className="mt-auto space-y-4">
          <ProgressBar raised={campaign.raisedAmount} goal={campaign.goalAmount} status={campaign.status} />
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="text-sm">
              <p className="text-gray-500">By</p>
              <p className="font-medium text-gray-900">{campaign.creator?.name || 'Creator'}</p>
            </div>
            <Link 
              to={`/campaign/${campaign._id}`}
              className="flex items-center text-primary font-medium hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg"
            >
              View Details <TrendingUp className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
