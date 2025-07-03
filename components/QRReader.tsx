'use client';

import { useState, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

interface QRReaderProps {
  className?: string;
}

export default function QRReader({ className = '' }: QRReaderProps) {
  const [scannedText, setScannedText] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    return () => {
      if (readerRef.current) {
        readerRef.current.reset();
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      setError('');
      setIsScanning(true);
      
      const codeReader = new BrowserMultiFormatReader();
      readerRef.current = codeReader;
      
      const videoInputDevices = await codeReader.listVideoInputDevices();
      if (videoInputDevices.length === 0) {
        throw new Error('カメラが見つかりません');
      }

      const selectedDeviceId = videoInputDevices[0].deviceId;
      
      codeReader.decodeFromVideoDevice(selectedDeviceId, videoRef.current!, (result, error) => {
        if (result) {
          setScannedText(result.getText());
          setIsScanning(false);
          codeReader.reset();
        }
        if (error && error.name !== 'NotFoundException') {
          console.error('QRコード読み取りエラー:', error);
        }
      });
    } catch (err) {
      console.error('カメラアクセスエラー:', err);
      setError('カメラへのアクセスに失敗しました。ブラウザの設定を確認してください。');
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (readerRef.current) {
      readerRef.current.reset();
    }
    setIsScanning(false);
  };

  const clearResult = () => {
    setScannedText('');
    setError('');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">QRコード読み取り</h1>
        <p className="text-gray-600">PCでスマートフォンのQRコードを読み取り</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="w-144 h-108 object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          {!isScanning ? (
            <button
              onClick={startScanning}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              スキャン開始
            </button>
          ) : (
            <button
              onClick={stopScanning}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              スキャン停止
            </button>
          )}
          
          {scannedText && (
            <button
              onClick={clearResult}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              クリア
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {scannedText && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">読み取り結果:</h3>
            <p className="text-green-700 whitespace-pre-wrap break-words">{scannedText}</p>
          </div>
        )}

        {isScanning && (
          <div className="text-center">
            <p className="text-sm text-gray-600">
              QRコードをカメラに向けてください
            </p>
          </div>
        )}
      </div>
    </div>
  );
}