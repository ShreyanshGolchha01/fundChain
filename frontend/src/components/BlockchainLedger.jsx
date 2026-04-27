import { format } from 'date-fns';
import { ShieldCheck, Hash } from 'lucide-react';

const BlockchainLedger = ({ donations }) => {
  if (!donations || donations.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="flex items-center mb-4">
        <ShieldCheck className="w-5 h-5 text-gray-400 mr-2" />
        <h3 className="text-lg font-bold text-gray-900">Blockchain Records</h3>
      </div>
      <p className="text-xs text-gray-500 mb-4 italic">
        * This is a simulated blockchain for educational purposes.
      </p>

      <div className="space-y-3">
        {donations.map((donation) => (
          <div key={donation._id} className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-300 shadow-inner">
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-800">
              <span className="text-primary font-bold">Block #{donation.blockNumber}</span>
              <span className="text-xs text-gray-500">{format(new Date(donation.timestamp), 'dd MMM yyyy, HH:mm:ss')}</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-start">
                <Hash className="w-4 h-4 text-gray-600 mr-2 mt-0.5" />
                <div className="break-all">
                  <span className="text-gray-500">TX ID: </span>
                  <span className="text-gray-100">{donation.transactionId}</span>
                </div>
              </div>
              <div className="flex items-start">
                <Hash className="w-4 h-4 text-gray-600 mr-2 mt-0.5" />
                <div className="break-all">
                  <span className="text-gray-500">Hash: </span>
                  <span className="text-green-400">{donation.blockHash}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockchainLedger;
