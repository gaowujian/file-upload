import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import logger from "morgan";
import { StatusCodes } from "http-status-codes";
import cors from "cors";
import path from "path";
import { PUBLIC_DIR } from "./utils";
import fs from "fs-extra";
import multiparty from "multiparty";
let app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.resolve(__dirname, "public")));

app.post("/upload", function (req: Request, res: Response, next: NextFunction) {
  let form = new multiparty.Form();
  //   console.log(form);
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return next(err);
    }
    const filename = fields.fileName[0];
    const chunk = files.chunk[0];
    await fs.move(chunk.path, path.resolve(PUBLIC_DIR, filename), {
      overwrite: true,
    });
    setTimeout(() => {
      res.json({
        success: true,
      });
    }, 3000);
  });
});

//接收任何没处理的请求
// 如果tsconfig中设置了没有不可用参数，当参数没有使用到的时候，可以使用_变量名，避免报错，
app.use(function (_req: Request, _res: Response, next) {
  next(createError(404));
});
app.use(function (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR);
  res.json({
    success: false,
    error,
  });
});

export default app;
