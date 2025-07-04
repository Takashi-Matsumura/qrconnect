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
  
  // 連続受信モード関連
  const [continuousMode, setContinuousMode] = useState(false);
  const [lastReceiveTime, setLastReceiveTime] = useState<number>(0);
  const [duplicateCount, setDuplicateCount] = useState<number>(0);

  useEffect(() => {
    return () => {
      if (readerRef.current) {
        readerRef.current.reset();
      }
    };
  }, []);

  // QRコード読み取り結果を処理
  const handleQRResult = (qrData: string) => {
    const currentTime = Date.now();
    const chunk = decodeChunk(qrData);
    
    if (!chunk) {
      setError('QRコードの読み取りに失敗しました');
      return;
    }
    
    // 単一チャンクの場合（分割なし）
    if (chunk.total === 1) {
      setScannedText(chunk.data);
      setIsScanning(false);
      setContinuousMode(false);
      if (readerRef.current) {
        readerRef.current.reset();
      }
      return;
    }
    
    // 分割チャンクの場合
    setIsMultiMode(true);
    setContinuousMode(true);
    
    // 重複チェック：同じチャンクを短時間で複数回受信した場合
    if (receivedChunks.has(chunk.index)) {
      setDuplicateCount(prev => prev + 1);
      console.log(`重複受信: チャンク${chunk.index} (${duplicateCount + 1}回目)`);
      return; // 重複の場合は処理をスキップ
    }
    
    const isNewChunk = multiQRManager.addReceivedChunk(chunk);
    if (isNewChunk) {
      const newReceivedChunks = new Set(receivedChunks);
      newReceivedChunks.add(chunk.index);
      setReceivedChunks(newReceivedChunks);
      setLastReceiveTime(currentTime);
      
      console.log(`新規チャンク受信: ${chunk.index}/${chunk.total}`);
      
      const status = multiQRManager.getReceiveStatus();
      setReceiveStatus(status);
      
      // 受信成功のフィードバック（簡易的な音声フィードバック）
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('受信');
        utterance.volume = 0.3;
        utterance.rate = 2;
        speechSynthesis.speak(utterance);
      }
      
      // 全チャンク受信完了
      if (status.complete) {
        const combinedData = multiQRManager.getCombinedData();
        if (combinedData) {
          setScannedText(combinedData);
          setIsScanning(false);
          setContinuousMode(false);
          
          // 完了通知
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance('受信完了');
            utterance.volume = 0.5;
            speechSynthesis.speak(utterance);
          }
          
          if (readerRef.current) {
            readerRef.current.reset();
          }
        }
      }
      // 分割モードでは受信完了まで継続スキャン（停止しない）
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
    setContinuousMode(false);
    setReceiveStatus({ received: 0, total: 0, complete: false });
    setReceivedChunks(new Set());
    setLastReceiveTime(0);
    setDuplicateCount(0);
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
              📤 分割受信モード {continuousMode && <span className="ml-2 text-sm">🔄 連続受信中</span>}
            </h3>
            <div className="space-y-3">
              {/* プログレスバー */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-blue-700">受信状況:</span>
                  <span className="font-medium text-blue-800">
                    {receiveStatus.received} / {receiveStatus.total} 完了
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(receiveStatus.received / receiveStatus.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* 受信済みチャンクの表示 */}
              <div className="text-sm text-blue-700">
                <span>受信済み: </span>
                <div className="inline-flex flex-wrap gap-1 mt-1">
                  {Array.from({ length: receiveStatus.total }, (_, i) => i + 1).map(index => (
                    <span
                      key={index}
                      className={`px-2 py-1 text-xs rounded transition-colors duration-300 ${
                        receivedChunks.has(index)
                          ? 'bg-green-100 text-green-800 animate-pulse'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {index}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* ステータス表示 */}
              {receiveStatus.complete ? (
                <div className="text-sm text-green-700 font-medium flex items-center">
                  ✅ 全データの受信が完了しました
                  {duplicateCount > 0 && (
                    <span className="ml-2 text-xs text-gray-500">
                      (重複: {duplicateCount}回)
                    </span>
                  )}
                </div>
              ) : continuousMode ? (
                <div className="text-sm text-blue-600 flex items-center">
                  🔄 自動受信中... カメラにモバイル画面を向けたままお待ちください
                </div>
              ) : (
                <div className="text-sm text-blue-600">
                  📱 次のQRコードをスキャンしてください
                </div>
              )}
              
              {/* 最後の受信時刻 */}
              {lastReceiveTime > 0 && (
                <div className="text-xs text-gray-500">
                  最終受信: {new Date(lastReceiveTime).toLocaleTimeString()}
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
              {continuousMode 
                ? `🔄 自動受信中（${receiveStatus.received}/${receiveStatus.total} 受信済み）- モバイル画面を向けたままお待ちください`
                : isMultiMode 
                  ? `QRコードをカメラに向けてください（${receiveStatus.received}/${receiveStatus.total} 受信済み）`
                  : 'QRコードをカメラに向けてください'
              }
            </p>
            {continuousMode && (
              <div className="mt-2 flex justify-center">
                <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>連続スキャン中</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}