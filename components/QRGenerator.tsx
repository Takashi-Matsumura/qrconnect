'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { testTextOptions, TestTextOption } from '@/utils/testTextGenerator';
import QRCodeModal from './QRCodeModal';

interface QRGeneratorProps {
  className?: string;
}

const MAX_CHARACTERS = 2000; // QRコードの実用的な文字数制限

export default function QRGenerator({ className = '' }: QRGeneratorProps) {
  const [text, setText] = useState('Hello QRConnect!');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showTestOptions, setShowTestOptions] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const isOverLimit = text.length > MAX_CHARACTERS;
  const remainingChars = MAX_CHARACTERS - text.length;

  // 文字数に応じてQRコードサイズを動的に計算
  const calculateQRSize = (textLength: number): number => {
    if (textLength <= 100) return 400;     // 短いテキスト: 大きなサイズ
    if (textLength <= 500) return 500;     // 中程度: より大きなサイズ
    if (textLength <= 1000) return 600;    // 長いテキスト: 最大サイズ
    if (textLength <= 1500) return 700;    // 非常に長い: 超大サイズ
    return 800;                            // 最長: 最大限のサイズ
  };

  const generateTestText = (option: TestTextOption) => {
    const generatedText = option.generator();
    setText(generatedText);
    setShowTestOptions(false);
  };

  useEffect(() => {
    const generateQRCode = async () => {
      
      if (text.trim() === '') {
        setQrCodeUrl('');
        setIsGenerating(false);
        return;
      }
      
      if (isOverLimit) {
        setError(`文字数制限を超えています（${text.length}文字 / ${MAX_CHARACTERS}文字）`);
        setQrCodeUrl('');
        setIsGenerating(false);
        return;
      }

      try {
        setError('');
        setIsGenerating(true);

        // シンプルなQRコード生成（サイズ指定なし）
        const url = await QRCode.toDataURL(text, {
          margin: 2,
          errorCorrectionLevel: 'M'
        });
        setQrCodeUrl(url);
      } catch {
        setError('QRコードの生成に失敗しました。');
        setQrCodeUrl('');
      } finally {
        setIsGenerating(false);
      }
    };

    generateQRCode();
  }, [text, isOverLimit]);

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">QRコード生成</h1>
        <p className="text-gray-600">スマートフォンからデータを送信</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
            送信したいテキスト
          </label>
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
              isOverLimit 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            rows={4}
            placeholder="QRコードにしたいテキストを入力してください"
            maxLength={MAX_CHARACTERS + 100} // 多少の余裕を持たせる
          />
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm text-gray-600">
              <strong>文字数制限：</strong> {MAX_CHARACTERS}文字
            </div>
            <div className={`text-sm font-medium ${
              isOverLimit 
                ? 'text-red-600' 
                : remainingChars < 100 
                  ? 'text-orange-600' 
                  : 'text-gray-600'
            }`}>
              {remainingChars >= 0 ? `残り ${remainingChars}文字` : `${Math.abs(remainingChars)}文字オーバー`}
            </div>
          </div>
          
          {/* テストテキスト生成ボタン */}
          <div className="mt-3">
            <button
              onClick={() => setShowTestOptions(!showTestOptions)}
              className="px-4 py-2 bg-purple-500 text-white text-sm rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              📝 テストテキスト生成
            </button>
          </div>

          {/* テストテキストオプション */}
          {showTestOptions && (
            <div className="mt-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-3">文字数制限検証用テストテキスト</h4>
              <div className="grid grid-cols-1 gap-2">
                {testTextOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => generateTestText(option)}
                    className="text-left p-3 bg-white border border-purple-200 rounded-md hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                  >
                    <div className="font-medium text-purple-800">{option.name}</div>
                    <div className="text-sm text-purple-600 mt-1">{option.description}</div>
                    <div className="text-xs text-purple-500 mt-1">予想文字数: {option.expectedLength}文字</div>
                  </button>
                ))}
              </div>
              <div className="mt-3 text-center">
                <button
                  onClick={() => setShowTestOptions(false)}
                  className="text-sm text-purple-600 hover:text-purple-800"
                >
                  閉じる
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">{error}</p>
            <p className="text-red-600 text-sm mt-1">
              文字数を{MAX_CHARACTERS}文字以内に収めてください。
            </p>
          </div>
        )}

        <div className="space-y-3">
          {/* QRコード情報表示（QRコードの上に表示）*/}
          {qrCodeUrl && (
            <div className="flex justify-center">
              <div className="inline-flex items-center space-x-4 bg-gray-100 px-4 py-2 rounded-full text-sm">
                <span className="flex items-center">
                  📄 <span className="ml-1 font-medium">{text.length}文字</span>
                </span>
                <span className="flex items-center">
                  📱 <span className="ml-1">{calculateQRSize(text.length)}px</span>
                </span>
                <span className="flex items-center">
                  🔍 <span className="ml-1">高解像度</span>
                </span>
              </div>
            </div>
          )}
          
          {/* QRコードサムネイル表示エリア */}
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-lg shadow-md">
              {qrCodeUrl ? (
                <div className="space-y-3">
                  {/* タップ可能なQRコードサムネイル */}
                  <div 
                    onClick={() => setIsModalOpen(true)}
                    className="cursor-pointer w-64 h-64 border-2 border-gray-300 rounded-lg overflow-hidden bg-white hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    <img 
                      src={qrCodeUrl} 
                      alt="生成されたQRコード（タップで拡大）"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  {/* タップヒント */}
                  <div className="text-center">
                    <p className="text-xs text-gray-500">👆 タップして拡大表示</p>
                  </div>
                </div>
              ) : (
                <div className="w-64 h-64 bg-gray-100 rounded flex items-center justify-center">
                  <p className="text-gray-500 text-center px-4 text-sm">
                    {isOverLimit 
                      ? '文字数制限を超えています' 
                      : isGenerating 
                        ? 'QRコードを生成中...' 
                        : 'QRコードを準備中...'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {!isOverLimit && qrCodeUrl && (
          <div className="text-center">
            <p className="text-sm text-gray-600">
              PCのカメラでこのQRコードを読み取ってください
            </p>
          </div>
        )}

        {/* 簡潔な使用方法のヒント */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-800 mb-2 flex items-center">
            💡 使用のヒント
          </h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• PCで同じURLを開いてカメラで読み取ってください</li>
            <li>• 照明を明るくすると読み取りやすくなります</li>
            <li>• 文字数が多いほどQRコードが複雑になります</li>
            <li>• 詳細な技術情報は「ヘルプ・技術情報」タブをご覧ください</li>
          </ul>
        </div>
      </div>

      {/* QRコード拡大モーダル */}
      <QRCodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        qrCodeUrl={qrCodeUrl}
        textLength={text.length}
        qrSize={calculateQRSize(text.length)}
      />
    </div>
  );
}