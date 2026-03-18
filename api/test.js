import fs from 'fs';

export default async function handler(req, res) {
  const hedefDosya = '/tmp/kanit_hesap_A.txt';
  let sızıntıIcerigi = null;
  let hataMesaji = null;
  let mevcutTmp = [];

  try {
    // 1. Önce /tmp dizininde neler var bak (Başkasının izi var mı?)
    mevcutTmp = fs.readdirSync('/tmp');

    // 2. Ana hesabın bıraktığı dosyayı "çalmaya" çalış
    sızıntıIcerigi = fs.readFileSync(hedefDosya, 'utf8');
  } catch (e) {
    hataMesaji = e.message;
  }

  res.status(200).json({
    durum: sızıntıIcerigi ? "🚨 KAPI KIRILDI! IZOLASYON YOK!" : "🛡️ Kilit şimdilik tutuyor",
    bulunan_dosyalar: mevcutTmp,
    sizdirilan_veri: sızıntıIcerigi,
    hata_detayi: hataMesaji,
    not: "Eğer listede kanit_hesap_A.txt yoksa, Vercel bizi farklı konteynırlara koymuş demektir."
  });
}
