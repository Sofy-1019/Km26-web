// /api/zoho-unread.js
//
// Función serverless de Vercel (gratis, no necesita Blaze ni servidor propio).
// El panel de KM26 le pregunta a esta función "¿hay mails nuevos?", y esta
// función es la que efectivamente habla con Zoho usando las credenciales
// secretas — que viven en Variables de Entorno de Vercel, nunca en el
// código que se sube a GitHub, así nadie más las puede ver.
//
// Devuelve algo como:
// { "ventas": 3, "proveedores": 0, "total": 3 }

export default async function handler(req, res) {

    // Se puede llamar desde el panel sin login extra, pero solo permitimos
    // que la llame nuestro propio dominio (evita que cualquier otro sitio
    // use esta función para consultar tu correo).
    res.setHeader("Access-Control-Allow-Origin", "https://km26.com.ar");

    try {

        const clientId = process.env.ZOHO_CLIENT_ID;
        const clientSecret = process.env.ZOHO_CLIENT_SECRET;
        const refreshToken = process.env.ZOHO_REFRESH_TOKEN;

        if (!clientId || !clientSecret || !refreshToken) {
            res.status(500).json({ error: "Faltan las variables de entorno de Zoho en Vercel." });
            return;
        }

        const tokenResp = await fetch(
            `https://accounts.zoho.com/oauth/v2/token?refresh_token=${refreshToken}&client_id=${clientId}&client_secret=${clientSecret}&grant_type=refresh_token`,
            { method: "POST" }
        );
        const tokenData = await tokenResp.json();

        if (!tokenData.access_token) {
            res.status(500).json({ error: "No se pudo renovar el acceso a Zoho.", detalle: tokenData });
            return;
        }

        const accessToken = tokenData.access_token;
        const headers = { Authorization: `Zoho-oauthtoken ${accessToken}` };

        const cuentasResp = await fetch("https://mail.zoho.com/api/accounts", { headers });
        const cuentasData = await cuentasResp.json();
        const cuentas = cuentasData.data || [];

        const resultado = {};

        for (const cuenta of cuentas) {

            const direccion = (cuenta.mailboxAddress || cuenta.primaryEmailAddress || "").toLowerCase();
            if (!direccion.includes("@km26.com.ar")) continue;

            const foldersResp = await fetch(`https://mail.zoho.com/api/accounts/${cuenta.accountId}/folders`, { headers });
            const foldersData = await foldersResp.json();
            const inbox = (foldersData.data || []).find(f => f.folderType === "Inbox");

            const alias = direccion.split("@")[0];
            resultado[alias] = inbox ? Number(inbox.unreadCount || 0) : 0;

        }

        resultado.total = Object.values(resultado).reduce((s, n) => s + (Number(n) || 0), 0);

        res.status(200).json(resultado);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}
