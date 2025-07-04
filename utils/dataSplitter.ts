// データ分割・結合用のユーティリティ関数

export interface QRChunk {
  index: number;        // チャンクのインデックス（1から始まる）
  total: number;        // 総チャンク数
  data: string;         // 実際のデータ
  checksum: string;     // データ整合性チェック用
}

export interface QRChunkStatus {
  received: boolean;
  data?: string;
}

// データを指定された最大文字数で分割
export function splitData(data: string, maxChunkSize: number = 400): QRChunk[] {
  if (data.length <= maxChunkSize) {
    // 分割不要の場合
    return [{
      index: 1,
      total: 1,
      data: data,
      checksum: generateChecksum(data)
    }];
  }

  const chunks: QRChunk[] = [];
  const totalChunks = Math.ceil(data.length / maxChunkSize);
  
  for (let i = 0; i < totalChunks; i++) {
    const start = i * maxChunkSize;
    const end = Math.min(start + maxChunkSize, data.length);
    const chunkData = data.slice(start, end);
    
    chunks.push({
      index: i + 1,
      total: totalChunks,
      data: chunkData,
      checksum: generateChecksum(chunkData)
    });
  }
  
  return chunks;
}

// QRチャンクをQRコード用文字列にエンコード
export function encodeChunk(chunk: QRChunk): string {
  if (chunk.total === 1) {
    // 分割なしの場合は元のデータをそのまま
    return chunk.data;
  }
  
  return `[${chunk.index}/${chunk.total}:${chunk.checksum}]${chunk.data}`;
}

// QRコード文字列をチャンクにデコード
export function decodeChunk(qrData: string): QRChunk | null {
  // 分割データの形式チェック
  const splitMatch = qrData.match(/^\[(\d+)\/(\d+):([a-f0-9]+)\](.*)$/);
  
  if (splitMatch) {
    const [, indexStr, totalStr, checksum, data] = splitMatch;
    const index = parseInt(indexStr, 10);
    const total = parseInt(totalStr, 10);
    
    // チェックサム検証
    if (generateChecksum(data) !== checksum) {
      console.warn('チェックサムが一致しません');
      return null;
    }
    
    return {
      index,
      total,
      data,
      checksum
    };
  }
  
  // 分割されていないデータの場合
  return {
    index: 1,
    total: 1,
    data: qrData,
    checksum: generateChecksum(qrData)
  };
}

// 受信したチャンクから元のデータを結合
export function combineChunks(chunks: QRChunk[]): string | null {
  if (chunks.length === 0) return null;
  
  // 単一チャンクの場合
  if (chunks.length === 1 && chunks[0].total === 1) {
    return chunks[0].data;
  }
  
  // 複数チャンクの場合
  const totalExpected = chunks[0].total;
  
  // 全チャンクが揃っているかチェック
  if (chunks.length !== totalExpected) {
    return null;
  }
  
  // インデックス順にソート
  const sortedChunks = chunks.sort((a, b) => a.index - b.index);
  
  // 連続性チェック
  for (let i = 0; i < sortedChunks.length; i++) {
    if (sortedChunks[i].index !== i + 1) {
      return null;
    }
    if (sortedChunks[i].total !== totalExpected) {
      return null;
    }
  }
  
  // データを結合
  return sortedChunks.map(chunk => chunk.data).join('');
}

// シンプルなチェックサム生成（MD5の代替）
function generateChecksum(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32bit整数に変換
  }
  return Math.abs(hash).toString(16);
}

// 分割送信状況を管理するクラス
export class MultiQRManager {
  private chunks: QRChunk[] = [];
  private receivedChunks: Map<number, QRChunk> = new Map();
  
  // 送信用：データを分割してチャンクを生成
  initSender(data: string, maxChunkSize: number = 400): void {
    this.chunks = splitData(data, maxChunkSize);
  }
  
  // 送信用：指定されたインデックスのチャンクを取得
  getChunk(index: number): QRChunk | null {
    return this.chunks.find(chunk => chunk.index === index) || null;
  }
  
  // 送信用：総チャンク数を取得
  getTotalChunks(): number {
    return this.chunks.length > 0 ? this.chunks[0].total : 0;
  }
  
  // 受信用：チャンクを追加
  addReceivedChunk(chunk: QRChunk): boolean {
    // 既に受信済みかチェック
    if (this.receivedChunks.has(chunk.index)) {
      return false; // 重複
    }
    
    this.receivedChunks.set(chunk.index, chunk);
    return true; // 新規受信
  }
  
  // 受信用：受信状況を取得
  getReceiveStatus(): { received: number; total: number; complete: boolean } {
    const chunks = Array.from(this.receivedChunks.values());
    const total = chunks.length > 0 ? chunks[0].total : 0;
    const received = this.receivedChunks.size;
    const complete = received === total && total > 0;
    
    return { received, total, complete };
  }
  
  // 受信用：完成したデータを取得
  getCombinedData(): string | null {
    const chunks = Array.from(this.receivedChunks.values());
    return combineChunks(chunks);
  }
  
  // 受信用：リセット
  reset(): void {
    this.receivedChunks.clear();
  }
}