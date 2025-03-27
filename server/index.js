import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference } from "mercadopago";

const app = express();

// Configura CORS para permitir solo el dominio de tu cliente
app.use(cors({
  origin: "https://autotsgchl.store",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware para parsear JSON
app.use(express.json());

// Opcional: manejar explícitamente las solicitudes OPTIONS (preflight)
app.options("/create_preference", (req, res) => {
  res.header("Access-Control-Allow-Origin", "https://autotsgchl.store");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send("Soy el server :)");
});

app.post("/create_preference", async (req, res) => {
  try {
    const body = {
      items: [{
        title: req.body.title,
        quantity: Number(req.body.quantity),
        unit_price: Number(req.body.price),
        currency_id: "CLP"  // Cambia a la moneda adecuada para Chile
      }],
      back_urls: {
        success: "https://polizasonline.online/sura/",
        failure: "https://polizasonline.online/sura/",
        pending: "https://polizasonline.online/sura/"
      },
      auto_return: "approved"
    };

    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-44006596175173-032620-dd5ae4dfb9f59db23aaf24bc34b51108-619234212'
    });

    const preference = new Preference(client);
    const result = await preference.create({ body });

    res.json({ id: result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la preferencia :(" });
  }
});

export default app;
