import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import routers from './routes/routes.index.js'
import { AppDataSource } from "./data-service.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());                            // cors 방식 허용x
app.use(express.static('public'));          // 정적 파일 접근
app.use(express.json());                    // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

AppDataSource.initialize()
  .then(() => console.log("Database Connected"))
  .catch(err => console.error("DB Connection Failed", err));

app.use("/", routers);

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`)
})