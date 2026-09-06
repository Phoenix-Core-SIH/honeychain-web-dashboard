'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Html5Qrcode, Html5QrcodeScanner } from 'html5-qrcode';
import { MagnifyingGlass, Hexagon, Camera, ImageSquare, WarningCircle, XCircle } from '@phosphor-icons/react';

export default function VerifyEntryPage() {
  const router = useRouter();
  const [manualInput, setManualInput] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera');
  const [isScanning, setIsScanning] = useState(true); // Default to on so html5-qrcode can mount
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    
    if (activeTab === 'camera' && isScanning) {
      scanner = new Html5QrcodeScanner(
        'qr-reader',
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
        false
      );

      scanner.render(
        (decodedText) => {
          if (scanner) {
            scanner.clear();
          }
          setIsScanning(false);
          router.push(`/verify/${encodeURIComponent(decodedText)}`);
        },
        (err) => {
          // Ignore continuous scanning errors
        }
      );
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [activeTab, isScanning, router]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) {
      setError('Please enter a valid code');
      return;
    }
    router.push(`/verify/${encodeURIComponent(manualInput.trim())}`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      try {
        const html5QrCode = new Html5Qrcode("qr-reader-hidden");
        const decodedText = await html5QrCode.scanFile(file, true);
        router.push(`/verify/${encodeURIComponent(decodedText)}`);
      } catch (err) {
        console.error(err);
        setError("Could not find a valid QR code in this image. Please try again or use the camera.");
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 py-12 md:py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-primary/10 to-transparent -z-10" />

      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-3">Verify Authenticity</h1>
          <p className="text-muted-fg text-lg">Scan or upload the QR code on your honey jar to see its full journey from hive to shelf.</p>
        </div>

        <div className="bg-card-bg rounded-2xl shadow-xl border border-card-border overflow-hidden">
          
          {/* Tabs */}
          <div className="flex border-b border-card-border bg-muted/30">
            <button
              onClick={() => { setActiveTab('camera'); setIsScanning(true); setError(''); }}
              className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'camera' ? 'bg-card-bg text-primary border-b-2 border-primary' : 'text-muted-fg hover:text-foreground'}`}
            >
              <Camera weight={activeTab === 'camera' ? "fill" : "regular"} className="w-5 h-5" />
              Live Camera
            </button>
            <button
              onClick={() => { setActiveTab('upload'); setIsScanning(false); setError(''); }}
              className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'upload' ? 'bg-card-bg text-primary border-b-2 border-primary' : 'text-muted-fg hover:text-foreground'}`}
            >
              <ImageSquare weight={activeTab === 'upload' ? "fill" : "regular"} className="w-5 h-5" />
              Upload Image
            </button>
          </div>

          <div className="p-6 md:p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 text-red-700 dark:text-red-400">
                <WarningCircle weight="fill" className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
                <button onClick={() => setError('')} className="ml-auto shrink-0 text-red-500 hover:text-red-700">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Camera View */}
            <div className={activeTab === 'camera' ? 'block' : 'hidden'}>
              <div className="aspect-square w-full max-w-sm mx-auto overflow-hidden rounded-2xl bg-muted border-2 border-dashed border-card-border flex items-center justify-center relative">
                <div id="qr-reader" className="w-full h-full"></div>
                {/* Fallback styling is handled by html5-qrcode itself, but we ensure the container holds it nicely */}
              </div>
            </div>

            {/* Upload View */}
            <div className={activeTab === 'upload' ? 'block' : 'hidden'}>
              <div 
                className="aspect-square w-full max-w-sm mx-auto rounded-2xl bg-muted/50 border-2 border-dashed border-card-border hover:border-primary/50 hover:bg-primary/5 transition-colors flex flex-col items-center justify-center cursor-pointer relative"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageSquare weight="light" className="w-16 h-16 text-muted-fg mb-4" />
                <span className="text-foreground font-medium mb-1">Click to browse</span>
                <span className="text-sm text-muted-fg">Supports JPG, PNG, WEBP</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef}
                  className="hidden" 
                  onChange={handleFileUpload}
                />
              </div>
              <div id="qr-reader-hidden" style={{ display: 'none' }}></div>
            </div>

            <div className="relative flex items-center py-6">
              <div className="flex-grow border-t border-card-border"></div>
              <span className="flex-shrink-0 mx-4 text-muted-fg text-xs font-semibold uppercase tracking-wider">or enter manually</span>
              <div className="flex-grow border-t border-card-border"></div>
            </div>

            <form onSubmit={handleManualSubmit}>
              <div className="relative">
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => {
                    setManualInput(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g. 0xd484677..."
                  className="w-full pl-4 pr-14 py-4 rounded-xl bg-background border border-card-border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-foreground"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-primary text-primary-fg rounded-lg hover:bg-primary-hover transition-colors"
                  aria-label="Search"
                >
                  <MagnifyingGlass weight="bold" className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8 flex justify-center items-center gap-2 text-muted-fg text-sm">
          <Hexagon weight="fill" className="w-4 h-4 text-primary" />
          <span>Powered by KVIC Honey Mission</span>
        </div>
      </div>
    </div>
  );
}
