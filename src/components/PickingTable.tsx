import { PickingData } from '../lib/data-service';
import { cn } from '../lib/utils';

interface PickingTableProps {
  data: PickingData[];
}

export function PickingTable({ data }: PickingTableProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col overflow-hidden flex-grow">
      <div className="overflow-auto flex-grow">
        <table className="w-full text-center text-lg border-collapse relative">
          <thead className="sticky top-0 z-10">
            <tr className="bg-slate-800 text-white font-black uppercase border-b border-slate-900 text-xl">
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Criteria</th>
              <th className="p-4">Allocated</th>
              <th className="p-4 text-emerald-400">QC</th>
              <th className="p-4">Picking</th>
              <th className="p-4 text-amber-400">Waiting</th>
              <th className="p-4 bg-slate-900">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-bold text-slate-800">
            {data.map((row, idx) => {
              const cat = row.kategori.toUpperCase().trim();
              return (
                <tr 
                  key={idx} 
                  className={cn(
                    "transition-all duration-200 border-b border-slate-200",
                    cat === '1P' && "bg-slate-200/40",
                    cat === '2P' && "bg-blue-200/50",
                    cat === '3P' && "bg-emerald-200/50",
                    "hover:brightness-95"
                  )}
                >
                  <td className="p-4 text-left">
                    <span className="text-5xl font-black text-slate-900 uppercase">
                      {row.kategori}
                    </span>
                  </td>
                  <td className="p-4 text-left">
                    <div className="uppercase text-3xl font-black text-slate-800 tracking-tight leading-tight">
                      {row.kriteria}
                    </div>
                  </td>
                  <td className="p-4 font-mono text-4xl text-blue-700">{row.allocated}</td>
                  <td className="p-4 font-mono text-4xl text-emerald-700">{row.pickingConfirmed}</td>
                  <td className="p-4 font-mono text-4xl text-indigo-700">{row.printed}</td>
                  <td className="p-4 font-mono text-4xl text-amber-700">{row.waiting}</td>
                  <td className="p-4 font-mono text-slate-950 font-black text-5xl bg-slate-900/10">{row.grandTotal}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
