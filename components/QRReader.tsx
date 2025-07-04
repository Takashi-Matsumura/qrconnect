'use client';

import { useState, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { MultiQRManager, decodeChunk } from '@/utils/dataSplitter';

interface QRReaderProps {
  className?: string;
}

export default function QRReader({ className = '' }: QRReaderProps) {
  const [scannedText, setScannedText] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  
  // 分割受信モード関連のstate
  const [multiQRManager] = useState(() => new MultiQRManager());
  const [isMultiMode, setIsMultiMode] = useState(false);
  const [receiveStatus, setReceiveStatus] = useState({ received: 0, total: 0, complete: false });
  const [receivedChunks, setReceivedChunks] = useState<Set<number>>(new Set());

  useEffect(() => {
    return () => {
      if (readerRef.current) {
        readerRef.current.reset();
      }
    };
  }, []);

  // QRコード読み取り結果を処理
  const handleQRResult = (qrData: string) => {
    const chunk = decodeChunk(qrData);
    
    if (!chunk) {
      setError('QRコードの読み取りに失敗しました');
      return;
    }
    
    // 単一チャンクの場合（分割なし）
    if (chunk.total === 1) {
      setScannedText(chunk.data);
      setIsScanning(false);
      if (readerRef.current) {
        readerRef.current.reset();
      }
      return;
    }
    
    // 分割チャンクの場合
    setIsMultiMode(true);
    
    const isNewChunk = multiQRManager.addReceivedChunk(chunk);
    if (isNewChunk) {
      const newReceivedChunks = new Set(receivedChunks);
      newReceivedChunks.add(chunk.index);
      setReceivedChunks(newReceivedChunks);
      
      const status = multiQRManager.getReceiveStatus();
      setReceiveStatus(status);
      
      // 全チャンク受信完了
      if (status.complete) {
        const combinedData = multiQRManager.getCombinedData();
        if (combinedData) {
          setScannedText(combinedData);
          setIsScanning(false);
          if (readerRef.current) {
            readerRef.current.reset();
          }
        }
      }
    }
  };

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
          handleQRResult(result.getText());
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
    setIsMultiMode(false);
    setReceiveStatus({ received: 0, total: 0, complete: false });
    setReceivedChunks(new Set());
    multiQRManager.reset();
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

        {/* 分割受信状況表示 */}
        {isMultiMode && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
              📤 分割受信モード
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-blue-700">受信状況:</span>
                <span className="font-medium text-blue-800">
                  {receiveStatus.received} / {receiveStatus.total} 完了
                </span>
              </div>
              
              {/* 受信済みチャンクの表示 */}
              <div className="text-sm text-blue-700">
                <span>受信済み: </span>
                <div className="inline-flex flex-wrap gap-1 mt-1">
                  {Array.from({ length: receiveStatus.total }, (_, i) => i + 1).map(index => (
                    <span
                      key={index}
                      className={`px-2 py-1 text-xs rounded ${
                        receivedChunks.has(index)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {index}
                    </span>
                  ))}
                </div>
              </div>
              
              {receiveStatus.complete ? (
                <div className="text-sm text-green-700 font-medium">
                  ✅ 全データの受信が完了しました
                </div>
              ) : (
                <div className="text-sm text-blue-600">
                  📱 次のQRコードをスキャンしてください
                </div>
              )}
            </div>
          </div>
        )}

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
              {isMultiMode 
                ? `QRコードをカメラに向けてください（${receiveStatus.received}/${receiveStatus.total} 受信済み）`
                : 'QRコードをカメラに向けてください'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}