import { successHandler } from "../middlewares/responseHandler.js";
import { botManager } from "../services/bot.service.js";

// 봇 시스템 시작
export const startBots = async (req, res, next) => {
  try {
    const {
      botCount,
      minDelay,
      maxDelay,
      minSeatSelectDelay,
      maxSeatSelectDelay,
    } = req.body;

    const config = {};
    if (minDelay !== undefined) config.minDelay = minDelay;
    if (maxDelay !== undefined) config.maxDelay = maxDelay;
    if (minSeatSelectDelay !== undefined)
      config.minSeatSelectDelay = minSeatSelectDelay;
    if (maxSeatSelectDelay !== undefined)
      config.maxSeatSelectDelay = maxSeatSelectDelay;

    botManager.start(botCount, config);

    return successHandler(res, "봇 시스템이 시작되었습니다.", {
      botCount: botCount || botManager.config.botCount,
      config: { ...botManager.config, ...config },
    });
  } catch (error) {
    next(error);
  }
};

// 봇 시스템 중지
export const stopBots = async (req, res, next) => {
  try {
    botManager.stop();
    return successHandler(res, "봇 시스템이 중지되었습니다.");
  } catch (error) {
    next(error);
  }
};

// 봇 시스템 상태 조회
export const getBotStatus = async (req, res, next) => {
  try {
    const status = botManager.getStatus();
    return successHandler(res, "봇 시스템 상태 조회", status);
  } catch (error) {
    next(error);
  }
};


export const enableTestModeController = (req, res) => {
  botManager.enableTestMode();
  return successHandler(res, "봇 테스트 모드 활성화" );
};

export const disableTestModeController = (req, res) => {
  botManager.disableTestMode();
  return successHandler(res, "봇 테스트 모드 비활성화" );
};