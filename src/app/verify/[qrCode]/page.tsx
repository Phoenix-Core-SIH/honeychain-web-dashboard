'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { CheckCircle, XCircle, Clock, MapPin, User, Hexagon, ArrowLeft, Drop } from '@phosphor-icons/react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface CustodyStep {
  step: number;
  stage: string;
  from: string;
  to: string;
  timestamp_iso: string;
  location_hash: string;
  tx: string | null;
}

interface VerifyResponse {
  verified: boolean;
  qr_id: string;
  jar_serial?: string;
  batch_id?: string;
  honey_type?: string;
  beekeeper_name?: string;
  harvest_date?: string;
  quantity_kg?: number;
  quality_grade?: string;
  lab_report?: string;
  custody_chain?: CustodyStep[];
  error?: string;
  warning?: string;
}

export default function VerifyResultPage() {
  const params = useParams();
  const [data, setData] = useState<VerifyResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!params?.qrCode) return;
      const qrCodeStr = Array.isArray(params?.qrCode) ? params.qrCode[0] : params?.qrCode as string;
      try {
        const response = await fetchApi<VerifyResponse>(`/public/verify/${qrCodeStr}`);
        setData(response);
      } catch (err: any) {
        setData({
          verified: false,
          qr_id: qrCodeStr,
          error: err.message || 'Verification failed. The code may be invalid or not yet activated on-chain.',
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params.qrCode]);

  if (loading) {
    return (
      <div className="flex-1 bg-background flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-primary font-medium">Verifying blockchain records...</p>
      </div>
    );
  }

  if (!data || !data.verified) {
    return (
      <div className="flex-1 bg-background flex flex-col items-center p-4 md:p-8 pt-12">
        <div className="max-w-md w-full bg-card-bg rounded-2xl shadow-xl overflow-hidden border border-red-500/20">
          <div className="bg-red-500 p-8 text-center text-white">
            <XCircle weight="fill" className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-2xl font-bold font-serif">Verification Failed</h1>
            <p className="text-red-100 mt-2">We could not find an authentic record for this code.</p>
          </div>
          <div className="p-6">
            <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 p-4 rounded-xl text-sm mb-6 border border-red-100 dark:border-red-800/50">
              <strong className="font-semibold">Error:</strong> {data?.error || 'Unknown error'}
            </div>
            <p className="text-muted-fg text-sm mb-6 text-center leading-relaxed">
              This honey jar may be counterfeit, or the QR code has not been activated by the distributor yet.
            </p>
            <Link href="/verify" className="flex items-center justify-center w-full py-3 bg-muted text-foreground rounded-xl font-medium hover:bg-card-border transition-colors">
              <ArrowLeft weight="bold" className="w-4 h-4 mr-2" />
              Scan another code
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/20 to-transparent pt-12 pb-24 px-4 text-center">
        <div className="max-w-xl mx-auto relative">
          <Link href="/verify" className="absolute left-0 top-0 p-2 bg-card-bg/50 hover:bg-card-bg text-muted-fg hover:text-foreground rounded-full transition-colors border border-card-border backdrop-blur-sm">
            <ArrowLeft weight="bold" className="w-6 h-6" />
          </Link>
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4 text-primary border-4 border-primary/20 shadow-xl shadow-primary/10">
            <CheckCircle weight="fill" className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Verified Authentic</h1>
          <p className="text-primary text-lg font-medium">100% Pure KVIC Honey</p>
          
          {data.warning && (
            <div className="mt-6 bg-yellow-100/50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 text-yellow-800 dark:text-yellow-500 text-sm py-2 px-4 rounded-lg inline-block text-left">
              {data.warning}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-xl mx-auto px-4 -mt-16 space-y-6 relative z-10">
        
        {/* Product Details Card */}
        <div className="bg-card-bg rounded-2xl shadow-xl p-6 border border-card-border">
          <h2 className="text-lg font-bold text-foreground border-b border-card-border pb-3 mb-5 flex items-center gap-2">
            <Drop weight="fill" className="w-5 h-5 text-primary" />
            Product Details
          </h2>
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <p className="text-xs text-muted-fg uppercase tracking-wider font-semibold mb-1">Honey Type</p>
              <p className="text-foreground font-medium">{data.honey_type || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-fg uppercase tracking-wider font-semibold mb-1">Quality Grade</p>
              <p className="text-foreground font-medium">{data.quality_grade || 'Standard'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-fg uppercase tracking-wider font-semibold mb-1">Harvest Date</p>
              <p className="text-foreground font-medium">{data.harvest_date || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-fg uppercase tracking-wider font-semibold mb-1">Batch Volume</p>
              <p className="text-foreground font-medium">{data.quantity_kg ? `${data.quantity_kg} kg` : 'Unknown'}</p>
            </div>
          </div>
        </div>

        {/* Origin Card */}
        <div className="bg-card-bg rounded-2xl shadow-xl p-6 border border-card-border">
          <h2 className="text-lg font-bold text-foreground border-b border-card-border pb-3 mb-5 flex items-center gap-2">
            <User weight="fill" className="w-5 h-5 text-secondary" />
            Origin Story
          </h2>
          <div className="flex items-start gap-4">
            <div className="bg-secondary/10 p-3 rounded-xl text-secondary shrink-0">
              <Hexagon weight="fill" className="w-6 h-6" />
            </div>
            <div>
              <p className="text-muted-fg text-sm leading-relaxed">
                This honey was harvested by <span className="font-semibold text-foreground">{data.beekeeper_name || 'our partner beekeeper'}</span>. 
                By purchasing this jar, you are directly supporting rural livelihoods through the KVIC Honey Mission.
              </p>
            </div>
          </div>
        </div>

        {/* Provenance Timeline */}
        {data.custody_chain && data.custody_chain.length > 0 && (
          <div className="bg-card-bg rounded-2xl shadow-xl p-6 border border-card-border">
            <h2 className="text-lg font-bold text-foreground border-b border-card-border pb-3 mb-6 flex items-center gap-2">
              <MapPin weight="fill" className="w-5 h-5 text-primary" />
              Traceability Journey
            </h2>
            
            <div className="relative pl-6 border-l-2 border-primary/30 space-y-8 pb-2">
              {/* Origin Event */}
              <div className="relative">
                <div className="absolute w-4 h-4 bg-primary rounded-full -left-[1.65rem] top-1 border-4 border-card-bg shadow-sm"></div>
                <h3 className="font-bold text-foreground">Harvested at Hive</h3>
                <p className="text-xs text-muted-fg flex items-center gap-1 mt-1 font-medium">
                  <Clock weight="bold" className="w-3 h-3" /> {data.harvest_date || 'Origin'}
                </p>
                <p className="text-sm text-muted-fg mt-1">Registered by {data.beekeeper_name}</p>
              </div>

              {/* Transfer Events */}
              {data.custody_chain.map((step) => (
                <div key={step.step} className="relative">
                  <div className="absolute w-4 h-4 bg-primary/80 rounded-full -left-[1.65rem] top-1 border-4 border-card-bg shadow-sm"></div>
                  <h3 className="font-bold text-foreground">Transferred to {step.stage}</h3>
                  <p className="text-xs text-muted-fg flex items-center gap-1 mt-1 font-medium">
                    <Clock weight="bold" className="w-3 h-3" /> {new Date(step.timestamp_iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-xs text-muted-fg/70 mt-1 truncate max-w-[200px]">Tx: {step.tx?.substring(0, 16)}...</p>
                </div>
              ))}
              
              {/* Current Event */}
              <div className="relative">
                <div className="absolute w-4 h-4 bg-secondary rounded-full -left-[1.65rem] top-1 border-4 border-card-bg shadow-sm shadow-secondary/20"></div>
                <h3 className="font-bold text-secondary">QR Activated / Verified</h3>
                <p className="text-xs text-muted-fg flex items-center gap-1 mt-1 font-medium">
                  <Clock weight="bold" className="w-3 h-3" /> Just now
                </p>
                <p className="text-sm text-muted-fg mt-1">Ready for you to enjoy!</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
