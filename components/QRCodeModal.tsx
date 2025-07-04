'use client';

import { useEffect, useState } from 'react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeUrl: string;
  textLength: number;
  qrSize: number;
  // 分割QR関連のプロパティを追加
  allQRUrls?: string[];
  isSplitMode?: boolean;
  totalChunks?: number;
}

export default function QRCodeModal({ 
  isOpen, 
  onClose, 
  qrCodeUrl, 
  textLength, 
  qrSize,
  allQRUrls = [],
  isSplitMode = false,
  totalChunks = 1
}: QRCodeModalProps) {
  // 自動ループ再生の状態管理
  const [autoPlay, setAutoPlay] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playSpeed, setPlaySpeed] = useState(3000); // 3秒間隔
  
  // 分割QRの場合のQRコードリスト
  const qrUrls = isSplitMode ? allQRUrls : [qrCodeUrl];
  const currentQRUrl = qrUrls[currentIndex] || qrCodeUrl;
  // 自動ループ再生のタイマー
  useEffect(() => {
    if (isOpen && isSplitMode && autoPlay && qrUrls.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % qrUrls.length);
      }, playSpeed);
      
      return () => clearInterval(interval);
    }
  }, [isOpen, isSplitMode, autoPlay, qrUrls.length, playSpeed]);

  // モーダル開閉時の初期化
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setAutoPlay(isSplitMode); // 分割モードの場合のみ自動再生を有効
    }
  }, [isOpen, isSplitMode]);

  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
      // スペースキーで一時停止/再開
      if (event.key === ' ' && isSplitMode) {
        event.preventDefault();
        setAutoPlay(prev => !prev);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // スクロールを無効化
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, isSplitMode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景オーバーレイ */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* モーダルコンテンツ */}
      <div className="relative z-10 max-w-full max-h-full p-4">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="モーダルを閉じる"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* QRコード表示エリア */}
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          {/* ヘッダー情報 */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4">
            {isSplitMode ? (
              <div className="space-y-3">
                {/* 分割QR情報 */}
                <div className="flex items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <span>📤</span>
                    <span className="font-medium">分割送信</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>📄</span>
                    <span className="font-medium">{currentIndex + 1}/{totalChunks}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🔄</span>
                    <span>{autoPlay ? '自動再生中' : '一時停止中'}</span>
                  </div>
                </div>
                
                {/* 自動再生コントロール */}
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => setAutoPlay(!autoPlay)}
                    className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-full text-sm transition-colors"
                  >
                    <span>{autoPlay ? '⏸️' : '▶️'}</span>
                    <span>{autoPlay ? '一時停止' : '再生'}</span>
                  </button>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <span>速度:</span>
                    <select 
                      value={playSpeed}
                      onChange={(e) => setPlaySpeed(Number(e.target.value))}
                      className="bg-white bg-opacity-20 text-white border-0 rounded px-2 py-1 text-sm"
                    >
                      <option value={2000} className="text-black">高速 (2秒)</option>
                      <option value={3000} className="text-black">標準 (3秒)</option>
                      <option value={4000} className="text-black">ゆっくり (4秒)</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <span>📄</span>
                  <span className="font-medium">{textLength}文字</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>📱</span>
                  <span>{qrSize}px</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🔍</span>
                  <span>高解像度</span>
                </div>
              </div>
            )}
          </div>

          {/* QRコード画像 */}
          <div className="p-6 flex justify-center relative">
            <img 
              src={currentQRUrl} 
              alt={`QRコード（拡大表示）${isSplitMode ? ` - ${currentIndex + 1}/${totalChunks}` : ''}`}
              className="w-full h-auto object-contain transition-opacity duration-300"
              style={{
                maxWidth: 'min(85vw, 85vh, 800px)',
                maxHeight: 'min(85vw, 85vh, 800px)',
                minWidth: '300px',
                minHeight: '300px'
              }}
            />
            
            {/* 分割QRのプログレスインジケーター */}
            {isSplitMode && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-1">
                  {qrUrls.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                        index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* フッター情報 */}
          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="text-center space-y-2">
              {isSplitMode ? (
                <>
                  <p className="text-sm text-gray-700 font-medium">
                    📷 PCのカメラにスマホ画面を向けたままお待ちください
                  </p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>🔄 QRコードが自動的に切り替わります</div>
                    <div>📱 カメラが全ての分割データを自動受信します</div>
                    <div>⏸️ スペースキーで一時停止/再開</div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-700 font-medium">
                    📷 PCのカメラでこのQRコードを読み取ってください
                  </p>
                  <div className="flex justify-center space-x-4 text-xs text-gray-500">
                    <span>💡 画面の明度を上げると読み取りやすくなります</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 操作ヒント */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-4 bg-black bg-opacity-60 text-white px-4 py-2 rounded-full text-sm">
            <span>📱 タップして閉じる</span>
            <span>⌨️ ESCキーでも閉じられます</span>
            {isSplitMode && <span>⏸️ スペースキーで一時停止</span>}
          </div>
        </div>
      </div>
    </div>
  );
}