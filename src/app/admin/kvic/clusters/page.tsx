'use client';

import { useEffect, useState } from 'react';
import { fetchKvicApi } from '@/lib/kvicApi';
import Link from 'next/link';
import { MapPin, Warning, Hexagon, TrendUp, ChartLineUp } from '@phosphor-icons/react';

interface Cluster {
  location: string;
  batches_this_period: number;
  active_hives?: number;
  beekeeper_count?: number;
  recent_disease_alerts?: number;
}

interface FederatedResponse<T> {
  partial: boolean;
  unavailable: string[];
  data: T;
}

export default function KvicClustersPage() {
  const [data, setData] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [partialWarning, setPartialWarning] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchKvicApi<FederatedResponse<Cluster[]>>('/clusters');
        setData(res.data);
        if (res.partial) {
          setPartialWarning(res.unavailable);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load clusters');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex justify-center py-24">
        <div className="w-12 h-12 border-4 border-card-border border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center">
            <Hexagon className="w-6 h-6 mr-2 text-primary" />
            KVIC Clusters Overview
          </h1>
          <p className="text-muted-fg mt-1">Federated view of regional operations</p>
        </div>
        <Link 
          href="/admin/kvic/analytics/disease"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition shadow-sm flex items-center"
        >
          <ChartLineUp className="w-4 h-4 mr-2" />
          Disease Heatmap
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">
          {error}
        </div>
      )}

      {partialWarning.length > 0 && (
        <div className="bg-background text-amber-800 p-4 rounded-xl mb-6 border border-amber-200 flex items-start">
          <Warning className="w-5 h-5 mr-3 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Partial Data Returned</p>
            <p className="text-sm mt-1">
              Some services are currently unavailable: <strong>{partialWarning.join(', ')}</strong>. 
              The dashboard is showing best-effort data based on available systems.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((cluster, i) => (
          <Link href={`/admin/kvic/clusters/${encodeURIComponent(cluster.location)}`} key={i}>
            <div className="bg-card-bg p-6 rounded-2xl border border-card-border shadow-sm hover:shadow-md transition cursor-pointer group">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center group-hover:text-amber-600 transition">
                <MapPin className="w-5 h-5 mr-2 text-slate-400 group-hover:text-primary" />
                {cluster.location}
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-fg">Batches Produced</span>
                  <span className="font-semibold text-foreground bg-slate-100 px-2 py-0.5 rounded">
                    {cluster.batches_this_period}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-fg">Active Hives</span>
                  <span className="font-semibold text-foreground">
                    {cluster.active_hives ?? 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-fg">Recent Disease Alerts</span>
                  <span className={`font-semibold ${cluster.recent_disease_alerts && cluster.recent_disease_alerts > 0 ? 'text-red-600 bg-red-50 px-2 py-0.5 rounded' : 'text-foreground'}`}>
                    {cluster.recent_disease_alerts ?? 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
        {data.length === 0 && !loading && !error && (
           <div className="col-span-full py-12 text-center text-muted-fg">
             No clusters found for your jurisdiction.
           </div>
        )}
      </div>
    </div>
  );
}
