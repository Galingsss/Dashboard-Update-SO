import { useEffect, useState } from 'react';
import { 
  BarChart3, 
  Printer, 
  CheckCircle2, 
  Package, 
  RefreshCw,
  LayoutDashboard,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchPickingData, PickingData } from './lib/data-service';
import { StatCard } from './components/StatCard';
import { PickingTable } from './components/PickingTable';

export default function App() {
  const [data, setData] = useState<PickingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchPickingData();
      setData(result);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch data from Google Sheets. Pleace check the public URL.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Auto refresh every 5 minutes
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const totals = data.reduce((acc, item) => ({
    allocated: acc.allocated + item.allocated,
    picking: acc.picking + item.pickingConfirmed,
    printed: acc.printed + item.printed,
    waiting: acc.waiting + item.waiting,
    total: acc.total + item.grandTotal
  }), { allocated: 0, picking: 0, printed: 0, waiting: 0, total: 0 });

  return (
    <div className="h-screen bg-slate-50 p-6 font-sans flex flex-col gap-5 text-slate-900 overflow-hidden">
      {/* Header Section */}
      <header className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded flex items-center justify-center shadow-sm">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">Picking Status Dashboard</h1>
            <p className="text-xs text-slate-500 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Feed: Google Sheets Sync
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-400 uppercase tracking-widest shadow-sm">
            Last Sync: {lastUpdated.toLocaleTimeString()}
          </div>
          <button 
            onClick={loadData}
            disabled={loading}
            className="p-2 bg-slate-800 text-white rounded shadow-sm hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={loading ? "animate-spin" : ""} size={16} />
          </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col gap-5">
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white border border-slate-200 p-12 rounded-lg text-center flex-grow flex flex-col items-center justify-center"
            >
              <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="text-red-500" size={32} />
              </div>
              <h2 className="text-lg font-bold text-slate-800 mb-2">Sync Connection Failed</h2>
              <p className="text-slate-500 text-sm max-w-md mb-6">{error}</p>
              <button 
                onClick={loadData}
                className="bg-slate-800 text-white px-8 py-2 rounded font-bold text-xs uppercase tracking-widest hover:bg-slate-700"
              >
                Reconnect Now
              </button>
            </motion.div>
          ) : loading && data.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-emerald-600 rounded-full animate-spin mb-4" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Synchronizing Data</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-5 flex-grow flex flex-col overflow-hidden"
            >
              {/* KPI Grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 shrink-0">
                <StatCard 
                  title="Total Demand" 
                  value={totals.total} 
                  icon={Package} 
                  className="bg-white border-slate-200 text-slate-900"
                />
                <StatCard 
                  title="Allocated" 
                  value={totals.allocated} 
                  icon={BarChart3} 
                  description="Status: Allocated"
                  className="bg-blue-50 border-blue-200 text-blue-700"
                />
                <StatCard 
                  title="Picking" 
                  value={totals.picking} 
                  icon={CheckCircle2} 
                  description="Status: Picking"
                  className="bg-emerald-50 border-emerald-200 text-emerald-700"
                />
                <StatCard 
                  title="Printed" 
                  value={totals.printed} 
                  icon={Printer} 
                  description="Status: Printed"
                  className="bg-indigo-50 border-indigo-200 text-indigo-700"
                />
                <StatCard 
                  title="Waiting" 
                  value={totals.waiting} 
                  icon={RefreshCw} 
                  description="Status: Waiting"
                  className="bg-amber-50 border-amber-200 text-amber-700"
                />
              </div>

              {/* Data Feed Section */}
              <PickingTable data={data} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Bar */}
      <footer className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-200 pt-4">
        <div className="flex gap-6">
          <span>REPORT ID: PK-SNAP-{lastUpdated.getTime().toString().slice(-6)}</span>
          <span className="hidden md:inline">LOC: OPERATION_CENTER</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          System Healthy - Optimized High Density Feed
        </div>
      </footer>
    </div>
  );
}

