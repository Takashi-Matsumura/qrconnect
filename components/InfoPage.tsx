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
                <li>• テキストを入力してQRコードを自動生成</li>
                <li>• 400文字以下：単一QRコードで送信</li>
                <li>• 400文字超過：自動的に分割QRモードに切り替え</li>
                <li>• 分割時は「前へ/次へ」ボタンでQRコードを切り替え</li>
                <li>• QRコードサムネイルをタップして拡大表示</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">2. PC側（受信）</h4>
              <ul className="space-y-1 ml-4">
                <li>• 同じURLをPCブラウザで開く</li>
                <li>• 自動的にカメラが起動</li>
                <li>• 単一QR：1つのQRコードをスキャン</li>
                <li>• 分割QR：順番に全てのQRコードをスキャン</li>
                <li>• データが自動的に結合・表示される</li>
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
              <h4 className="font-medium mb-1">文字数制限（日本語最適化）</h4>
              <ul className="space-y-1 ml-4">
                <li>• 単一QR制限: 400文字（日本語対応）</li>
                <li>• 分割QR: 無制限（400文字ずつ分割）</li>
                <li>• メタデータ: チャンクあたり14文字</li>
                <li>• チェックサム: データ整合性確認</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">品質設定</h4>
              <ul className="space-y-1 ml-4">
                <li>• エラー訂正レベル: M（中程度）</li>
                <li>• エンコーディング: UTF-8</li>
                <li>• マージン: 2セル</li>
                <li>• 高解像度出力対応</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">日本語テキスト最適化</h4>
              <ul className="space-y-1 ml-4">
                <li>• 1文字 = 約3バイト（UTF-8）</li>
                <li>• QR密度をカメラ読み取り用に調整</li>
                <li>• ひらがな・カタカナ・漢字対応</li>
                <li>• 複雑な文字でも確実にスキャン可能</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 分割QR機能 */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-medium text-purple-800 mb-3 flex items-center">
            🔀 分割QR機能
          </h3>
          <div className="space-y-3 text-sm text-purple-700">
            <div>
              <h4 className="font-medium mb-1">自動分割システム</h4>
              <ul className="space-y-1 ml-4">
                <li>• 400文字超過で自動的に分割モードに切り替え</li>
                <li>• 各チャンク400文字 + メタデータ14文字</li>
                <li>• インデックス、総数、チェックサムを自動付与</li>
                <li>• データ整合性の自動検証</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">送信側（モバイル）</h4>
              <ul className="space-y-1 ml-4">
                <li>• 「前へ/次へ」ボタンでQRコード切り替え</li>
                <li>• 進捗表示：「分割モード 2/4」</li>
                <li>• 各QRコードを順番にスキャン</li>
                <li>• 分割モード終了ボタンで通常モードに戻る</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">受信側（PC）</h4>
              <ul className="space-y-1 ml-4">
                <li>• 受信進捗の自動表示：「2/4受信済み」</li>
                <li>• 順序に関係なくスキャン可能</li>
                <li>• 全チャンク受信後、自動データ結合</li>
                <li>• エラー時は受信状況をリセット</li>
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

        {/* PWA機能 */}
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
          <h3 className="font-medium text-cyan-800 mb-3 flex items-center">
            📱 PWA（Progressive Web App）機能
          </h3>
          <div className="space-y-3 text-sm text-cyan-700">
            <div>
              <h4 className="font-medium mb-1">インストール機能</h4>
              <ul className="space-y-1 ml-4">
                <li>• ホーム画面にアプリとしてインストール可能</li>
                <li>• iOS Safari：共有ボタン →「ホーム画面に追加」</li>
                <li>• Android Chrome：自動インストールプロンプト</li>
                <li>• Windows/Mac：ブラウザのインストールボタン</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">オフライン機能</h4>
              <ul className="space-y-1 ml-4">
                <li>• Service Workerによる完全オフライン対応</li>
                <li>• アプリ本体とリソースの自動キャッシュ</li>
                <li>• ネットワーク切断時も正常動作</li>
                <li>• フォント・画像・スタイルの永続保存</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">ネイティブアプリ体験</h4>
              <ul className="space-y-1 ml-4">
                <li>• スタンドアロンモード（フルスクリーン）</li>
                <li>• アプリアイコンとスプラッシュ画面</li>
                <li>• 高速起動とスムーズな操作感</li>
                <li>• バックグラウンド更新対応</li>
              </ul>
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
                <li>• レスポンシブデザイン</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">QRコード関連</h4>
              <ul className="space-y-1 ml-4">
                <li>• 生成: qrcode ライブラリ（カスタム最適化）</li>
                <li>• 読み取り: @zxing/library（マルチQR対応）</li>
                <li>• カメラアクセス: MediaDevices API</li>
                <li>• データ分割: 独自アルゴリズム</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">PWA・パフォーマンス</h4>
              <ul className="space-y-1 ml-4">
                <li>• next-pwa + Workbox</li>
                <li>• Service Worker自動生成</li>
                <li>• 高度なキャッシュ戦略</li>
                <li>• 静的生成 + 動的最適化</li>
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
                <li>• 単一QR限界（400文字）- 日本語最適化テスト</li>
                <li>• 分割送信 2分割（800文字）- 分割機能テスト</li>
                <li>• 分割送信 4分割（1500文字）- マルチQRテスト</li>
                <li>• 分割送信 7分割（2700文字）- 大容量分割テスト</li>
                <li>• 長文記事（6000文字）- 超大容量テスト</li>
                <li>• 実用データ形式（800文字）- vCard、WiFi、JSON</li>
                <li>• 長いURL（411文字）- パラメータ多数URL</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">テストの活用方法</h4>
              <ul className="space-y-1 ml-4">
                <li>• 文字数による動作確認</li>
                <li>• 分割機能の動作検証</li>
                <li>• 日本語・英数字・混合テキストのテスト</li>
                <li>• QRコード密度の視覚確認</li>
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
                <li>• QRコードを画面中央に配置</li>
                <li>• 分割QRの場合は順番を確認</li>
                <li>• ブラウザのカメラ権限を確認</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">分割QR関連の問題</h4>
              <ul className="space-y-1 ml-4">
                <li>• 順序確認：各QRコードの「1/4」表示をチェック</li>
                <li>• 受信進捗：PC側で「2/4受信済み」を確認</li>
                <li>• データ不整合：受信をリセットして再開</li>
                <li>• 分割モード終了：「分割モード終了」ボタンを使用</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">PWA・アプリの問題</h4>
              <ul className="space-y-1 ml-4">
                <li>• インストール失敗 → HTTPSで接続確認</li>
                <li>• オフライン不具合 → ブラウザキャッシュをクリア</li>
                <li>• 更新されない → アプリを再起動</li>
                <li>• iOS Safari：ホーム画面に追加を手動実行</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">一般的な問題</h4>
              <ul className="space-y-1 ml-4">
                <li>• カメラアクセス拒否 → ブラウザ設定を確認</li>
                <li>• 反射光の影響 → 角度を調整</li>
                <li>• 手ブレ → スマホを固定して撮影</li>
                <li>• 動作が重い → ブラウザを再起動</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}