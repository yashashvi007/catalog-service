import express, { Request, Response } from "express";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import categoryRouter from "./category/category-router";
import cookieParser from "cookie-parser";
import productRouter from "./product/product-router";

const app = express();

app.use(express.json());
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cookieParser());

app.use("/categories", categoryRouter);
app.use("/products", productRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.use(globalErrorHandler);

export default app;