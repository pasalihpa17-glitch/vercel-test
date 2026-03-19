module.exports = async (req, res) => {
    // Vercel'in bize vurduğu tüm damgaları okuyoruz
    const info = {
        owner_id: req.headers['x-vercel-id']?.split('::')[0] || "Bulunamadı", // fra1, iad1 vb. lokasyon + ID
        project_id: req.headers['x-vercel-deployment-url'] || "Bulunamadı",
        oidc_token_prefix: (req.headers['x-vercel-oidc-token'] || "").substring(0, 30), // Güvenlik için sadece başı
        proxy_sig: (req.headers['x-vercel-proxy-signature'] || "").substring(0, 20)
    };

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(info, null, 2));
};
