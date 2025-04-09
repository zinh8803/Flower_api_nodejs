const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/ProductRoute");
const categoryRoutes = require("./routes/Categoryroute");
const userRoutes = require("./routes/UsersRoute");
const OrderRoutes = require("./routes/OrderRoute");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cho phép truy cập ảnh đã upload

app.use("/api", productRoutes);
app.use("/api", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", OrderRoutes); 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`));
