'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { testTextOptions, TestTextOption } from '@/utils/testTextGenerator';
import QRCodeModal from './QRCodeModal';
import { MultiQRManager, encodeChunk, decodeChunk } from '@/utils/dataSplitter';

interface QRGeneratorProps {
  className?: string;
}

const MAX_CHARACTERS = 400; // 単一QRコードの実用的な文字数制限（日本語対応）

export default function QRGenerator({ className = '' }: QRGeneratorProps) {
  const [text, setText] = useState('Hello QRConnect!');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showTestOptions, setShowTestOptions] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // 分割モード関連のstate
  const [isSplitMode, setIsSplitMode] = useState(false);
  const [multiQRManager] = useState(() => new MultiQRManager());
  const [currentChunkIndex, setCurrentChunkIndex] = useState(1);
  const [allQRUrls, setAllQRUrls] = useState<string[]>([]);

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
    console.log('テストテキスト生成:', { 
      optionName: option.name, 
      expectedLength: option.expectedLength, 
      actualLength: generatedText.length,
      isOverLimit: generatedText.length > MAX_CHARACTERS,
      currentSplitMode: isSplitMode
    });
    
    // 分割モードをリセット
    if (isSplitMode) {
      console.log('分割モードをリセット中...');
      setIsSplitMode(false);
      setAllQRUrls([]);
      setCurrentChunkIndex(1);
      setQrCodeUrl('');
    }
    
    setText(generatedText);
    setShowTestOptions(false);
  };

  // 分割モードを開始
  const startSplitMode = async () => {
    try {
      setIsGenerating(true);
      setError('');
      
      console.log('分割モード開始:', { textLength: text.length, text: text.substring(0, 100) + '...' });
      
      // データを分割
      multiQRManager.initSender(text, 400);
      const totalChunks = multiQRManager.getTotalChunks();
      
      console.log('分割結果:', { 
        totalChunks, 
        chunkSize: 400, 
        originalTextLength: text.length,
        expectedChunks: Math.ceil(text.length / 400)
      });
      
      // 各チャンクのサイズを事前確認
      for (let i = 1; i <= totalChunks; i++) {
        const chunk = multiQRManager.getChunk(i);
        if (chunk) {
          console.log(`事前確認 チャンク${i}:`, {
            dataLength: chunk.data.length,
            expectedLength: i < totalChunks ? 400 : text.length % 400 || 400
          });
        }
      }
      
      // 全チャンクのQRコードを生成
      const urls: string[] = [];
      for (let i = 1; i <= totalChunks; i++) {
        const chunk = multiQRManager.getChunk(i);
        if (chunk) {
          console.log(`チャンク${i}:`, { 
            index: chunk.index, 
            total: chunk.total, 
            dataLength: chunk.data.length,
            checksum: chunk.checksum 
          });
          
          const encodedData = encodeChunk(chunk);
          console.log(`エンコード後${i}:`, { 
            encodedLength: encodedData.length,
            preview: encodedData.substring(0, 50) + '...',
            metadataLength: encodedData.length - chunk.data.length,
            actualDataLength: chunk.data.length,
            isDataTooLong: chunk.data.length > 600
          });
          
          // デコードテスト
          const decodedChunk = decodeChunk(encodedData);
          console.log(`デコードテスト${i}:`, {
            success: !!decodedChunk,
            dataMatches: decodedChunk?.data === chunk.data,
            originalDataLength: chunk.data.length,
            decodedDataLength: decodedChunk?.data.length || 0,
            checksumMatches: decodedChunk?.checksum === chunk.checksum,
            indexMatches: decodedChunk?.index === chunk.index,
            totalMatches: decodedChunk?.total === chunk.total,
            // バイト数確認
            encodedDataBytes: new TextEncoder().encode(encodedData).length,
            originalDataBytes: new TextEncoder().encode(chunk.data).length,
            isJapanese: /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(chunk.data.substring(0, 50))
          });
          
          const url = await QRCode.toDataURL(encodedData, {
            margin: 2,
            errorCorrectionLevel: 'M'
          });
          urls.push(url);
        }
      }
      
      console.log('QRコード生成完了:', { 
        generatedUrls: urls.length, 
        firstUrlExists: !!urls[0],
        totalChunks: multiQRManager.getTotalChunks()
      });
      
      setAllQRUrls(urls);
      setCurrentChunkIndex(1);
      setQrCodeUrl(urls[0] || '');
      setIsSplitMode(true);
      
      console.log('分割モード状態更新完了:', { 
        isSplitMode: true, 
        currentChunkIndex: 1,
        qrCodeUrlSet: !!urls[0]
      });
    } catch (error) {
      console.error('分割QRコード生成エラー:', error);
      setError('分割QRコードの生成に失敗しました。');
    } finally {
      setIsGenerating(false);
      console.log('分割モード処理終了:', { isGenerating: false });
    }
  };

  // 分割モードを終了
  const exitSplitMode = () => {
    setIsSplitMode(false);
    setAllQRUrls([]);
    setCurrentChunkIndex(1);
    // 通常モードのQRコードを再生成
    generateSingleQRCode();
  };

  // 通常の単一QRコード生成
  const generateSingleQRCode = async () => {
    try {
      console.log('単一QRコード生成処理開始:', { textLength: text.length });
      setError('');
      setIsGenerating(true);

      const url = await QRCode.toDataURL(text, {
        margin: 2,
        errorCorrectionLevel: 'M'
      });
      console.log('単一QRコード生成成功');
      setQrCodeUrl(url);
    } catch (error) {
      console.error('単一QRコード生成エラー:', error);
      setError('QRコードの生成に失敗しました。');
      setQrCodeUrl('');
    } finally {
      setIsGenerating(false);
      console.log('単一QRコード生成処理終了');
    }
  };

  // チャンク切り替え
  const switchToChunk = (index: number) => {
    if (index >= 1 && index <= allQRUrls.length) {
      setCurrentChunkIndex(index);
      setQrCodeUrl(allQRUrls[index - 1]);
    }
  };

  useEffect(() => {
    console.log('useEffect実行:', { 
      textLength: text.length, 
      isOverLimit, 
      isSplitMode,
      textPreview: text.substring(0, 50) + '...'
    });
    
    const generateQRCode = async () => {
      // 分割モード中は何もしない
      if (isSplitMode) {
        console.log('分割モード中のためスキップ');
        return;
      }
      
      if (text.trim() === '') {
        console.log('テキストが空のためクリア');
        setQrCodeUrl('');
        setIsGenerating(false);
        return;
      }
      
      // 400文字超過の場合は自動的に分割モードに切り替え
      if (isOverLimit && !isSplitMode) {
        console.log('400文字超過のため自動分割モードに切り替え');
        await startSplitMode();
        return;
      }

      // 400文字以下の場合のみ単一QRコード生成
      if (!isOverLimit) {
        console.log('単一QRコード生成開始');
        await generateSingleQRCode();
      }
    };

    generateQRCode();
  }, [text, isOverLimit, isSplitMode]);

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          QRコード生成
          {isSplitMode && (
            <span className="ml-2 text-lg text-blue-600">
              (分割モード {currentChunkIndex}/{multiQRManager.getTotalChunks()})
            </span>
          )}
        </h1>
        <p className="text-gray-600">
          {isSplitMode 
            ? `スマートフォンから分割データを送信 - ${multiQRManager.getTotalChunks()}つのQRコードを順番にスキャン`
            : 'スマートフォンからデータを送信'
          }
        </p>
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
            maxLength={10000} // 分割送信対応のため上限を大幅に緩和
          />
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm text-gray-600">
              <strong>単一QRコード：</strong> {MAX_CHARACTERS}文字まで（日本語対応）
            </div>
            <div className={`text-sm font-medium ${
              isOverLimit 
                ? 'text-blue-600' 
                : remainingChars < 100 
                  ? 'text-orange-600' 
                  : 'text-gray-600'
            }`}>
              {remainingChars >= 0 ? `残り ${remainingChars}文字` : `分割送信 ${Math.ceil(text.length / MAX_CHARACTERS)}分割`}
            </div>
          </div>

          {/* 分割送信モード自動切り替えの通知 */}
          {isOverLimit && isSplitMode && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <div>
                  <p className="text-sm text-blue-800 font-medium">
                    🔄 自動分割送信モード
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    400文字を超えたため、データを自動的に分割してQRコードを生成しました
                  </p>
                </div>
              </div>
            </div>
          )}
          
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
            {!isSplitMode && (
              <p className="text-red-600 text-sm mt-1">
                {MAX_CHARACTERS}文字以内なら単一QRコード、超過時は自動的に分割送信されます。
              </p>
            )}
          </div>
        )}

        <div className="space-y-3">
          {/* QRコード情報表示（QRコードの上に表示）*/}
          {qrCodeUrl && (
            <div className="flex justify-center">
              <div className="inline-flex items-center space-x-4 bg-gray-100 px-4 py-2 rounded-full text-sm">
                {isSplitMode ? (
                  <>
                    <span className="flex items-center">
                      📤 <span className="ml-1 font-medium">分割送信</span>
                    </span>
                    <span className="flex items-center">
                      📄 <span className="ml-1">{currentChunkIndex}/{multiQRManager.getTotalChunks()}</span>
                    </span>
                    <span className="flex items-center">
                      📱 <span className="ml-1">高解像度</span>
                    </span>
                  </>
                ) : (
                  <>
                    <span className="flex items-center">
                      📄 <span className="ml-1 font-medium">{text.length}文字</span>
                    </span>
                    <span className="flex items-center">
                      📱 <span className="ml-1">{calculateQRSize(text.length)}px</span>
                    </span>
                    <span className="flex items-center">
                      🔍 <span className="ml-1">高解像度</span>
                    </span>
                  </>
                )}
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

                  {/* 分割モードナビゲーション */}
                  {isSplitMode && (
                    <div className="space-y-3">
                      {/* ナビゲーションボタン */}
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => switchToChunk(currentChunkIndex - 1)}
                          disabled={currentChunkIndex <= 1}
                          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          ← 前
                        </button>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                          {currentChunkIndex} / {multiQRManager.getTotalChunks()}
                        </span>
                        <button
                          onClick={() => switchToChunk(currentChunkIndex + 1)}
                          disabled={currentChunkIndex >= multiQRManager.getTotalChunks()}
                          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          次 →
                        </button>
                      </div>

                      {/* 分割モード終了ボタン */}
                      <div className="text-center">
                        <button
                          onClick={exitSplitMode}
                          className="px-4 py-2 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                          分割モード終了
                        </button>
                      </div>
                    </div>
                  )}
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

        {qrCodeUrl && (
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {isSplitMode 
                ? `PCのカメラで順番にQRコードを読み取ってください（${currentChunkIndex}/${multiQRManager.getTotalChunks()}）`
                : 'PCのカメラでこのQRコードを読み取ってください'
              }
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
            <li>• 400文字以下：単一QRコード、超過時：自動分割送信</li>
            <li>• 分割送信では前へ/次へボタンで順番にスキャンしてください</li>
            <li>• 照明を明るくすると読み取りやすくなります</li>
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