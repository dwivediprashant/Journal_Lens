const FRONTEND_URL = process.env.FRONTEND_URL;
const corsOptions = {
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  credentials: true,
};

export default corsOptions;
