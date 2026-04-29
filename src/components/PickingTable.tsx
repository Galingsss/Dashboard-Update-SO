import { PickingData } from '../lib/data-service';
import { cn } from '../lib/utils';

interface PickingTableProps {
  data: PickingData[];
}

export function PickingTable({ data }: PickingTableProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col overflow-hidden mt-2 flex-grow">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Detailed Operational Feed</h3>
        <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-black uppercase tracking-widest text-slate-500">{data.length} Records</span>
      </div>
      <div className="overflow-auto flex-grow">
        <table className="w-full text-center text-[11px] border-collapse relative">
          <thead className="sticky top-0 z-10">
            <tr className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-100">
              <th className="p-3">Date</th>
              <th className="p-3">Category</th>
              <th className="p-3">Criteria</th>
              <th className="p-3 font-black">Type</th>
              <th className="p-3">Alloc</th>
              <th className="p-3">Pick</th>
              <th className="p-3">Print</th>
              <th className="p-3">Wait</th>
              <th className="p-3">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-bold text-slate-800">
            {data.map((row, idx) => {
              const cat = row.kategori.toUpperCase().trim();
              return (
                <tr 
                  key={idx} 
                  className={cn(
                    "transition-all duration-200 border-b border-slate-100",
                    cat === '1P' && "bg-slate-50",
                    cat === '2P' && "bg-blue-50/80",
                    cat === '3P' && "bg-emerald-50/80",
                    "hover:brightness-95"
                  )}
                >
                  <td className="p-3 font-mono">{row.tanggal}</td>
                  <td className="p-3">
                    <span className="text-slate-500 uppercase">
                      {row.kategori}
                    </span>
                  </td>
                  <td className="p-3 uppercase text-[10px] tracking-tight">{row.kriteria}</td>
                  <td className="p-3">
                    <span className={cn(
                      "px-1.5 py-0.5 rounded text-[10px] font-black uppercase inline-block min-w-10",
                      row.dk_lk === 'DK' ? "text-blue-700 bg-blue-100" : "text-emerald-700 bg-emerald-100"
                    )}>
                      {row.dk_lk}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-600">{row.allocated}</td>
                  <td className="p-3 font-mono text-slate-600">{row.pickingConfirmed}</td>
                  <td className="p-3 font-mono text-slate-600">{row.printed}</td>
                  <td className="p-3 font-mono text-slate-600">{row.waiting}</td>
                  <td className="p-3 font-mono text-slate-950 font-black text-sm">{row.grandTotal}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
