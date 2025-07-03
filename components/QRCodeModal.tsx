'use client';

import { useEffect } from 'react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeUrl: string;
  textLength: number;
  qrSize: number;
}

export default function QRCodeModal({ 
  isOpen, 
  onClose, 
  qrCodeUrl, 
  textLength, 
  qrSize 
}: QRCodeModalProps) {
  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
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
  }, [isOpen, onClose]);

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
          </div>

          {/* QRコード画像 */}
          <div className="p-6 flex justify-center">
            <img 
              src={qrCodeUrl} 
              alt="QRコード（拡大表示）"
              className="w-full h-auto object-contain"
              style={{
                maxWidth: 'min(85vw, 85vh, 800px)',
                maxHeight: 'min(85vw, 85vh, 800px)',
                minWidth: '300px',
                minHeight: '300px'
              }}
            />
          </div>

          {/* フッター情報 */}
          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-700 font-medium">
                📷 PCのカメラでこのQRコードを読み取ってください
              </p>
              <div className="flex justify-center space-x-4 text-xs text-gray-500">
                <span>💡 画面の明度を上げると読み取りやすくなります</span>
              </div>
            </div>
          </div>
        </div>

        {/* 操作ヒント */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-4 bg-black bg-opacity-60 text-white px-4 py-2 rounded-full text-sm">
            <span>📱 タップして閉じる</span>
            <span>⌨️ ESCキーでも閉じられます</span>
          </div>
        </div>
      </div>
    </div>
  );
}