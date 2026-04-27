import { format } from 'date-fns';
import { UserCircle } from 'lucide-react';

const DonorList = ({ donations }) => {
  if (!donations || donations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-gray-100">
        <p>No donations yet. Be the first to contribute!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Donations</h3>
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-50">
        {donations.map((donation) => (
          <div key={donation._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full text-primary">
                <UserCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{donation.donor?.name || 'Anonymous'}</p>
                <p className="text-xs text-gray-500">{format(new Date(donation.timestamp), 'dd MMM yyyy, HH:mm')}</p>
              </div>
            </div>
            <div className="font-bold text-accent">
              ₹{donation.amount.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonorList;
