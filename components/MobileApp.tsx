'use client';

import { useState } from 'react';
import QRGenerator from './QRGenerator';
import InfoPage from './InfoPage';

interface MobileAppProps {
  className?: string;
}

type TabType = 'generator' | 'info';

export default function MobileApp({ className = '' }: MobileAppProps) {
  const [activeTab, setActiveTab] = useState<TabType>('generator');

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${className}`}>
      {/* メインコンテンツエリア */}
      <div className="pb-20"> {/* 下部ナビゲーション分のパディング */}
        <div className="max-w-md mx-auto">
          {activeTab === 'generator' ? (
            <div className="p-4 pt-8">
              <QRGenerator />
            </div>
          ) : (
            <div className="p-4 pt-8">
              <InfoPage />
            </div>
          )}
        </div>
      </div>

      {/* 下部タブナビゲーション */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex">
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex-1 py-3 px-4 text-center transition-colors ${
              activeTab === 'generator'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
            }`}
          >
            <div className="flex flex-col items-center space-y-1">
              <span className="text-lg">📱</span>
              <span className="text-xs font-medium">QRコード生成</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-3 px-4 text-center transition-colors ${
              activeTab === 'info'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
            }`}
          >
            <div className="flex flex-col items-center space-y-1">
              <span className="text-lg">📖</span>
              <span className="text-xs font-medium">ヘルプ・技術情報</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}