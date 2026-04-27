import { useState, useEffect } from 'react';
import api from '../services/api';
import { format } from 'date-fns';
import { Blocks, Hash, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlockchainExplorer = () => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    try {
      const res = await api.get('/blockchain/blocks');
      setBlocks(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-900 mb-4 shadow-xl">
          <Blocks className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Ledger Explorer</h1>
        <p className="text-gray-500 mt-2 font-medium max-w-2xl mx-auto">
          Explore the simulated blockchain ledger for all campaigns. Every donation creates a new block linked to the previous one via cryptographic hash.
        </p>
        <div className="mt-4 inline-block bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs px-3 py-1.5 rounded-lg font-bold">
          ⚠️ This is a simulated blockchain for educational purposes.
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {blocks.map((block) => (
            <div key={block._id} className="bg-gray-900 rounded-3xl p-6 shadow-xl border border-gray-800 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Blocks className="w-32 h-32 text-white" />
              </div>

              <div className="flex justify-between items-start mb-6 border-b border-gray-800 pb-4">
                <div>
                  <span className="text-primary font-bold text-xl block mb-1">Block #{block.blockNumber}</span>
                  <span className="text-xs text-gray-400 font-mono">{format(new Date(block.timestamp), 'dd MMM yyyy, HH:mm:ss.SSS')}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 block mb-1">Nonce</span>
                  <span className="text-gray-300 font-mono bg-gray-800 px-2 py-1 rounded text-sm">{block.nonce}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 font-mono text-sm">
                <div>
                  <p className="text-gray-500 mb-1 flex items-center text-xs uppercase tracking-wider"><Hash className="w-3 h-3 mr-1" /> Block Hash</p>
                  <p className="text-green-400 break-all bg-black/30 p-2 rounded border border-green-900/30">{block.hash}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1 flex items-center text-xs uppercase tracking-wider"><Hash className="w-3 h-3 mr-1" /> Previous Hash</p>
                  <p className="text-blue-400 break-all bg-black/30 p-2 rounded border border-blue-900/30">{block.previousHash}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-3 font-bold border-t border-gray-800 pt-4">Transactions ({block.transactions.length})</p>
                {block.transactions.length > 0 ? (
                  <div className="space-y-2">
                    {block.transactions.map(tx => (
                      <div key={tx._id} className="bg-gray-800 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-gray-700">
                        <div className="font-mono text-xs text-gray-400 truncate max-w-[200px]" title={tx.transactionId}>
                          {tx.transactionId.substring(0, 16)}...
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-300">
                          <span className="font-medium text-white">{tx.donor?.name || 'Unknown'}</span>
                          <ArrowRight className="w-4 h-4 text-gray-500" />
                          <Link to={`/campaign/${tx.campaign?._id || tx.campaign}`} className="text-primary hover:underline truncate max-w-[150px]">
                            {tx.campaign?.title || 'Campaign'}
                          </Link>
                        </div>
                        <div className="font-bold text-accent">
                          ₹{tx.amount.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm italic">No transactions (Genesis Block)</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlockchainExplorer;
