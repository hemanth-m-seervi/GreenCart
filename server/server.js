import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./configs/db.js";
import 'dotenv/config'
import userRouter from "./routs/userRoutes.js";
import sellerRouter from "./routs/sellerRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import productRouter from "./routs/productRoute.js";
import cartRouter from "./routs/cartRoute.js";
import addressRouter from "./routs/addressRoute.js";
import orderRouter from "./routs/orderRoute.js";
import { addAddress } from "./controllers/addressController.js";
import { stripeWebhook } from "./controllers/orderController.js";

const app = express();
const port = process.env.PORT || 4000;

await connectDB()
await connectCloudinary()


const allowedOrigins = ["http://localhost:5173"]

app.post('/stripe',express.raw({type:'application/json'}),stripeWebhook)

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins,credentials:true}));



app.get("/",(req,res)=> res.send("APIr is running"));
app.use("/api/user", userRouter)
app.use("/api/seller", sellerRouter)
app.use("/api/product", productRouter)
app.use("/api/cart", cartRouter)
app.use("/api/address",addressRouter)
app.use("/api/order",orderRouter)



app.listen(port,()=> console.log(`Server is running on  http://localhost:${port}`));