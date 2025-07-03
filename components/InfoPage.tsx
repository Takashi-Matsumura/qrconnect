'use client';

interface InfoPageProps {
  className?: string;
}

export default function InfoPage({ className = '' }: InfoPageProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">ヘルプ・技術情報</h1>
        <p className="text-gray-600">QRConnectの使い方と技術仕様</p>
      </div>

      <div className="space-y-6">
        {/* 使い方セクション */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-800 mb-3 flex items-center">
            📱 使い方ガイド
          </h3>
          <div className="space-y-3 text-sm text-green-700">
            <div>
              <h4 className="font-medium mb-1">1. スマートフォン側（送信）</h4>
              <ul className="space-y-1 ml-4">
                <li>• テキストを入力してQRコードを生成</li>
                <li>• 画面に表示されたQRコードをPCに向ける</li>
                <li>• 文字数制限（2,000文字）に注意</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">2. PC側（受信）</h4>
              <ul className="space-y-1 ml-4">
                <li>• 同じURLをPCブラウザで開く</li>
                <li>• 「スキャン開始」をクリック</li>
                <li>• カメラでQRコードを読み取り</li>
              </ul>
            </div>
          </div>
        </div>

        {/* QRコードの仕様 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-3 flex items-center">
            🔍 QRコードの仕様
          </h3>
          <div className="space-y-3 text-sm text-blue-700">
            <div>
              <h4 className="font-medium mb-1">文字数制限</h4>
              <ul className="space-y-1 ml-4">
                <li>• 推奨制限: 2,000文字</li>
                <li>• 日本語: 約1,800文字まで</li>
                <li>• 英数字: 約4,000文字まで</li>
                <li>• バイナリ: 約2,900バイトまで</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">品質設定</h4>
              <ul className="space-y-1 ml-4">
                <li>• エラー訂正レベル: M（中程度）</li>
                <li>• 生成スケール: 8倍（高解像度）</li>
                <li>• マージン: 2セル</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 表示サイズ最適化 */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-medium text-purple-800 mb-3 flex items-center">
            📐 表示サイズ最適化
          </h3>
          <div className="space-y-3 text-sm text-purple-700">
            <div>
              <h4 className="font-medium mb-1">動的サイズ調整</h4>
              <div className="bg-purple-100 p-3 rounded text-xs space-y-1">
                <div>• 〜100文字: 400px（見やすい大サイズ）</div>
                <div>• 〜500文字: 500px（中程度サイズ）</div>
                <div>• 〜1000文字: 600px（詳細表示）</div>
                <div>• 〜1500文字: 700px（高密度対応）</div>
                <div>• 1500文字〜: 800px（最大サイズ）</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-1">レスポンシブ表示</h4>
              <ul className="space-y-1 ml-4">
                <li>• 画面幅の最大90%まで拡大</li>
                <li>• 最大表示サイズ: 600px</li>
                <li>• 高解像度ディスプレイ対応</li>
              </ul>
            </div>
          </div>
        </div>

        {/* QRコードの構造 */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="font-medium text-orange-800 mb-3 flex items-center">
            🏗️ QRコードの構造
          </h3>
          <div className="space-y-3 text-sm text-orange-700">
            <div>
              <h4 className="font-medium mb-1">重要な構成要素</h4>
              <ul className="space-y-1 ml-4">
                <li>• ファインダーパターン: 四隅の□（位置検出用）</li>
                <li>• タイミングパターン: ファインダー間の点線</li>
                <li>• アライメントパターン: 大きなQRコードの中央付近の小□</li>
                <li>• データ領域: 実際の情報を格納</li>
                <li>• 静寂ゾーン: QRコード周囲の空白領域</li>
              </ul>
            </div>
            <div className="bg-orange-100 p-3 rounded">
              <h4 className="font-medium text-orange-800 mb-1">🛡️ 安全な表示設計</h4>
              <p className="text-xs text-orange-600">
                情報表示をQRコードの外側に配置することで、
                重要なパターンやデータ領域への干渉を防ぎ、確実な読み取りを保証しています。
              </p>
            </div>
          </div>
        </div>

        {/* 技術スタック */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-800 mb-3 flex items-center">
            ⚙️ 技術スタック
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <h4 className="font-medium mb-1">フロントエンド</h4>
              <ul className="space-y-1 ml-4">
                <li>• Next.js 15 + React 19</li>
                <li>• TypeScript（strict mode）</li>
                <li>• Tailwind CSS v4</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">QRコード関連</h4>
              <ul className="space-y-1 ml-4">
                <li>• 生成: qrcode ライブラリ</li>
                <li>• 読み取り: @zxing/library</li>
                <li>• カメラアクセス: MediaDevices API</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">PWA機能</h4>
              <ul className="space-y-1 ml-4">
                <li>• next-pwa</li>
                <li>• Service Worker</li>
                <li>• Web App Manifest</li>
                <li>• オフライン対応</li>
              </ul>
            </div>
          </div>
        </div>

        {/* テストテキスト生成 */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h3 className="font-medium text-indigo-800 mb-3 flex items-center">
            🧪 テストテキスト生成
          </h3>
          <div className="space-y-3 text-sm text-indigo-700">
            <p>
              「📝 テストテキスト生成」ボタンから、様々な文字数と文字種のテストパターンを生成できます。
            </p>
            <div>
              <h4 className="font-medium mb-1">利用可能なテストパターン</h4>
              <ul className="space-y-1 ml-4">
                <li>• 短いテキスト（100文字）- 基本テスト</li>
                <li>• 中程度（500文字）- 一般的な使用範囲</li>
                <li>• 大容量（1000文字）- 大容量データ</li>
                <li>• 制限近く（1800文字）- 日本語制限テスト</li>
                <li>• 制限超過（2500文字）- エラーテスト</li>
                <li>• 実用データ形式 - vCard、WiFi、JSON</li>
                <li>• URL形式 - 長いURLのテスト</li>
              </ul>
            </div>
          </div>
        </div>

        {/* トラブルシューティング */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-medium text-red-800 mb-3 flex items-center">
            🔧 トラブルシューティング
          </h3>
          <div className="space-y-3 text-sm text-red-700">
            <div>
              <h4 className="font-medium mb-1">QRコードが読み取れない場合</h4>
              <ul className="space-y-1 ml-4">
                <li>• カメラの焦点を合わせ直す</li>
                <li>• 照明を明るくする</li>
                <li>• 画面の明度を上げる</li>
                <li>• 文字数を減らしてシンプルにする</li>
                <li>• ブラウザのカメラ権限を確認</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">よくある問題</h4>
              <ul className="space-y-1 ml-4">
                <li>• 文字数制限超過 → 2,000文字以内に</li>
                <li>• カメラアクセス拒否 → ブラウザ設定を確認</li>
                <li>• 反射光の影響 → 角度を調整</li>
                <li>• 手ブレ → スマホを固定して撮影</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}