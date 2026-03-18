export default async function handler(req, res) {
  res.status(200).json({
    pid: process.pid,
    env_id: process.env.AWS_LAMBDA_LOG_STREAM_NAME, // Bu her çalışma için eşsizdir
    message: "Ben kurbanım, beklemedeyim."
  });
}
