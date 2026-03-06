'use client';

import { useState, useEffect } from 'react';
import { Trash2, Download, RefreshCw } from 'lucide-react';
import Footer from '../components/Footer';

interface CalcLead {
  fromCity: string;
  toCity: string;
  moveSize: string;
  moveDate: string | null;
  fullName: string;
  email: string;
  phone: string;
  distance: number;
  submittedAt: string;
}

interface AvailabilityLead {
  zip: string;
  moveDate: string;
  phone: string;
  submittedAt: string;
}

export default function Leads() {
  const [calcLeads, setCalcLeads] = useState<CalcLead[]>([]);
  const [availLeads, setAvailLeads] = useState<AvailabilityLead[]>([]);
  const [tab, setTab] = useState<'calc' | 'availability'>('calc');

  const loadLeads = () => {
    setCalcLeads(JSON.parse(localStorage.getItem('calc-leads') || '[]'));
    setAvailLeads(JSON.parse(localStorage.getItem('availability-leads') || '[]'));
  };

  useEffect(() => { loadLeads(); }, []);

  const clearLeads = (key: string) => {
    if (confirm('Are you sure you want to clear these leads?')) {
      localStorage.removeItem(key);
      loadLeads();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const exportCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(h => `"${String((row as unknown as Record<string, unknown>)[h] ?? '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen">
      <header className="py-4 px-4 glass sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-blue-800">Freedom</span>
            <span className="text-slate-800"> Movers</span>
            <span className="text-slate-400 text-lg font-normal ml-3">Leads</span>
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('calc')}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
              tab === 'calc' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Calculator Leads ({calcLeads.length})
          </button>
          <button
            onClick={() => setTab('availability')}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
              tab === 'availability' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Availability Leads ({availLeads.length})
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mb-4">
          <button onClick={loadLeads}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={() => exportCSV(
            tab === 'calc' ? calcLeads : availLeads,
            `${tab}-leads-${new Date().toISOString().slice(0,10)}.csv`
          )}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => clearLeads(tab === 'calc' ? 'calc-leads' : 'availability-leads')}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-red-200 rounded-lg text-sm text-red-600 hover:bg-red-50">
            <Trash2 className="w-4 h-4" /> Clear
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          {tab === 'calc' ? (
            calcLeads.length === 0 ? (
              <div className="p-12 text-center text-slate-400">No calculator leads yet</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="text-left p-3 font-medium text-slate-600">Name</th>
                      <th className="text-left p-3 font-medium text-slate-600">Email</th>
                      <th className="text-left p-3 font-medium text-slate-600">Phone</th>
                      <th className="text-left p-3 font-medium text-slate-600">From → To</th>
                      <th className="text-left p-3 font-medium text-slate-600">Size</th>
                      <th className="text-left p-3 font-medium text-slate-600">Date</th>
                      <th className="text-left p-3 font-medium text-slate-600">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...calcLeads].reverse().map((lead, i) => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="p-3 font-medium text-slate-900">{lead.fullName}</td>
                        <td className="p-3 text-slate-600">{lead.email}</td>
                        <td className="p-3 text-slate-600">{lead.phone}</td>
                        <td className="p-3 text-slate-600">{lead.fromCity} → {lead.toCity}</td>
                        <td className="p-3 text-slate-600">{lead.moveSize}</td>
                        <td className="p-3 text-slate-600">{lead.moveDate || 'Flexible'}</td>
                        <td className="p-3 text-slate-400 text-xs">{formatDate(lead.submittedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            availLeads.length === 0 ? (
              <div className="p-12 text-center text-slate-400">No availability leads yet</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="text-left p-3 font-medium text-slate-600">Zip Code</th>
                      <th className="text-left p-3 font-medium text-slate-600">Move Date</th>
                      <th className="text-left p-3 font-medium text-slate-600">Phone</th>
                      <th className="text-left p-3 font-medium text-slate-600">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...availLeads].reverse().map((lead, i) => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="p-3 font-medium text-slate-900">{lead.zip}</td>
                        <td className="p-3 text-slate-600">{lead.moveDate}</td>
                        <td className="p-3 text-slate-600">{lead.phone}</td>
                        <td className="p-3 text-slate-400 text-xs">{formatDate(lead.submittedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>

        {/* Webhook info */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800">
          <p className="font-medium mb-1">⚠️ Local Storage Only (Testing)</p>
          <p>These leads are stored in your browser only. To capture real visitor leads, set up the Google Sheets webhook — see the google-sheets-script.js file in the repo.</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
