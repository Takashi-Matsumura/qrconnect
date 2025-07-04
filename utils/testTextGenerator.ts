export interface TestTextOption {
  name: string;
  description: string;
  generator: () => string;
  expectedLength: number;
}

// 日本語テキスト生成
const generateJapaneseText = (targetLength: number): string => {
  const baseText = `これは日本語のテストテキストです。QRコードの文字数制限を検証するために作成されました。
ひらがな、カタカナ、漢字、記号が含まれています。
日本語文字は1文字あたりのバイト数が多いため、QRコードの容量制限に影響します。
テスト用データとして、様々な日本語表現を含んでいます：
• こんにちは、世界！
• カタカナテスト：アプリケーション、データベース、インターフェース
• 漢字テスト：情報技術、品質管理、効率化、最適化
• 特殊文字：①②③、（株）、※注意、★重要
• 長い文章のテスト：吾輩は猫である。名前はまだ無い。どこで生れたかとんと見当がつかぬ。`;

  let result = '';
  while (result.length < targetLength) {
    result += baseText + '\n';
  }
  return result.substring(0, targetLength);
};

// 英数字テキスト生成
const generateAlphanumericText = (targetLength: number): string => {
  const baseText = `This is an alphanumeric test text for QR code character limit validation.
It includes uppercase letters, lowercase letters, numbers, and basic symbols.
TEST DATA: ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
Special characters: !@#$%^&*()_+-=[]{}|;:,.<>?
URLs: https://example.com/test?param=value&id=123
Email: test@example.com
JSON: {"name":"test","value":123,"active":true}
UUID: 550e8400-e29b-41d4-a716-446655440000
Numbers: 1234567890 9876543210 1111222233334444
Base64: QWxhZGRpbjpvcGVuIHNlc2FtZQ==`;

  let result = '';
  while (result.length < targetLength) {
    result += baseText + '\n';
  }
  return result.substring(0, targetLength);
};

// 混合テキスト生成
const generateMixedText = (targetLength: number): string => {
  const baseText = `Mixed Language Test 混合言語テスト
English + 日本語 + Numbers 123 + Symbols !@#
API Response Example:
{
  "status": "success",
  "message": "データの取得に成功しました",
  "data": {
    "id": 12345,
    "name": "テストユーザー",
    "email": "test@example.co.jp",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "metadata": {
    "version": "1.0.0",
    "timestamp": "2024-01-01T12:34:56.789Z",
    "request_id": "req_abc123def456"
  }
}
URL with Japanese: https://example.co.jp/ページ?query=検索&id=123
Multilingual: Hello こんにちは Bonjour 你好 Hola`;

  let result = '';
  while (result.length < targetLength) {
    result += baseText + '\n';
  }
  return result.substring(0, targetLength);
};

// 実用的なデータ形式生成
const generatePracticalData = (targetLength: number): string => {
  const contact = `BEGIN:VCARD
VERSION:3.0
FN:山田太郎
ORG:株式会社テスト
TITLE:開発部長
TEL:+81-3-1234-5678
EMAIL:yamada@test.co.jp
URL:https://test.co.jp
ADR:;;東京都渋谷区1-2-3;;;日本
END:VCARD`;

  const wifi = `WIFI:T:WPA;S:TestNetwork;P:password123;H:false;;`;
  
  const json = `{
  "user": {
    "id": 12345,
    "name": "テストユーザー",
    "profile": {
      "age": 30,
      "location": "東京都",
      "interests": ["プログラミング", "読書", "映画鑑賞"]
    }
  },
  "settings": {
    "language": "ja-JP",
    "timezone": "Asia/Tokyo",
    "notifications": true
  }
}`;

  const baseText = `${contact}\n\n${wifi}\n\n${json}\n\n`;
  
  let result = '';
  while (result.length < targetLength) {
    result += baseText;
  }
  return result.substring(0, targetLength);
};

export const testTextOptions: TestTextOption[] = [
  {
    name: "短いテキスト (100文字)",
    description: "基本的なQRコード生成テスト",
    generator: () => generateJapaneseText(100),
    expectedLength: 100
  },
  {
    name: "単一QR限界 (400文字)",
    description: "1つのQRコードで送信可能な最大サイズ（日本語対応）",
    generator: () => generatePracticalData(400),
    expectedLength: 400
  },
  {
    name: "分割送信 2分割 (800文字)",
    description: "分割送信モードのテスト（2つのQRコード）",
    generator: () => generateMixedText(800),
    expectedLength: 800
  },
  {
    name: "分割送信 4分割 (1500文字)",
    description: "分割送信モードのテスト（4つのQRコード）",
    generator: () => generateJapaneseText(1500),
    expectedLength: 1500
  },
  {
    name: "分割送信 7分割 (2700文字)",
    description: "大容量分割送信のテスト（7つのQRコード）",
    generator: () => generateAlphanumericText(2700),
    expectedLength: 2700
  },
  {
    name: "長文記事 (6000文字)",
    description: "記事やドキュメント送信のテスト",
    generator: () => generateMixedText(6000),
    expectedLength: 6000
  },
  {
    name: "実用データ形式 (800文字)",
    description: "vCard、WiFi、JSON形式のデータ",
    generator: () => generatePracticalData(800),
    expectedLength: 800
  },
  {
    name: "長いURL (411文字)",
    description: "パラメータが多い長いURLのテスト",
    generator: () => `https://example.com/very/long/path/to/resource?param1=value1&param2=value2&param3=とても長いパラメータ値&param4=another_long_parameter_value&timestamp=${Date.now()}&session_id=abcd1234efgh5678ijkl9012mnop3456&user_id=user_123456789&callback_url=https://callback.example.com/success&error_url=https://callback.example.com/error&data=${encodeURIComponent('日本語データのテスト')}`,
    expectedLength: 411
  }
];