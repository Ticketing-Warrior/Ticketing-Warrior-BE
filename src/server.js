import dotenv from "dotenv";
dotenv.config();
import { AppDataSource } from "./config/dataConfig.js";
import express from "express";
import cors from "cors";
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";
import { errorHandler } from "./middlewares/errorHandler.js";
import routers from "./routes/routes.server.js";

const app = express();
const port = process.env.PORT;

app.use(cors()); // cors 방식 허용x
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

AppDataSource.initialize()
  .then(() => console.log("✅ Database Connected"))
  .catch((err) => console.error("❌ DB Connection Failed", err));

app.use("/", routers);

app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(
    {},
    {
      swaggerOptions: {
        url: "/openapi.json",
      },
    }
  )
);

app.get("/openapi.json", async (req, res, next) => {
  const options = {
    openapi: "3.0.0",
    disableLogs: true,
    writeOutputFile: false,
  };
  const outputFile = "/dev/null";
  const routes = ["./src/server.js"];
  const doc = {
    info: {
      title: "Ticketing Warrior",
      description:
        "선착순 예매 실패를 경험한 사용자들이 피지컬과 순발력을 훈련할 수 있도록 설계된 고부하 티켓팅 시뮬레이션 플랫폼입니다.",
    },
    host: "localhost:3000",
  };

  const result = await swaggerAutogen(options)(outputFile, routes, doc);
  res.json(result ? result.data : null);
});

//전역 오류 처리 미들웨어
app.use(errorHandler);

app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${port}`);
});
