import { insertQueue, getOutQueue } from "./queue.service.js";
import { getAllSeats } from "./seat.service.js";
import { botBookingConfirmation, processBookingConfirmation } from "./record.service.js";

// 봇 매니저 - 모든 봇의 상태와 동작을 관리
class BotManager {
  constructor() {
    this.bots = new Map();
    this.isEnabled = false;
    this.config = {
      botCount: 50, // 기본 봇 수
      minSeatSelectDelay: 5000, // 좌석 선택 최소 대기 시간 (ms)
      maxSeatSelectDelay: 30000, // 좌석 선택 최대 대기 시간 (ms)
    };
  }

  // 봇 시스템 시작
  start(botCount = null, config = {}) {
    // 이미 실행 중이면 중지 후 재시작
    if (this.isEnabled) {
      this.stop();
    }

    this.isEnabled = true;
    this.config = { ...this.config, ...config };
    const count = botCount || this.config.botCount;

    // 각 봇을 빠르게 생성 (짧은 간격으로)
    for (let i = 0; i < count; i++) {
      const botId = `bot_${Date.now()}_${i}`;
      const nickname = `bot_${i}`;

      // 각 봇마다 작은 무작위 지연 시간 (100ms ~ 500ms)
      const delay = this.getRandomDelay(100, 500);

      setTimeout(() => {
        this.createBot(botId, nickname);
      }, delay * i); // 각 봇마다 점진적으로 시작
    }
  }

  // 봇 시스템 중지
  stop() {
    if (!this.isEnabled) {
      return; // 이미 중지된 경우 그냥 리턴
    }

    console.log(`🛑 봇 시스템 중지: ${this.bots.size}개의 봇 종료`);

    // 모든 봇의 인터벌 정리
    this.bots.forEach((bot, botId) => {
      if (bot.intervalId) {
        clearTimeout(bot.intervalId);
      }
      this.bots.delete(botId);
    });

    this.isEnabled = false;
  }

  // 개별 봇 생성 및 실행
  async createBot(botId, nickname) {
    if (!this.isEnabled) {
      return;
    }

    const bot = {
      botId,
      nickname,
      isActive: true,
      intervalId: null,
    };

    this.bots.set(botId, bot);

    try {
      await this.runBotCycle(bot);
    } catch (error) {
      console.error(`봇 오류: ${nickname}`, error.message);
      // 에러 발생 시 봇 제거
      this.bots.delete(botId);
    }
  }

  // 봇의 한 사이클 실행 (대기열 진입 -> 좌석 선택 -> 예매 확정)
  async runBotCycle(bot) {
    if (!this.isEnabled || !bot.isActive) {
      return;
    }

    try {
      // 1단계: 봇 대기열 진입 시도
      await insertQueue(bot.nickname);

      // 무작위 대기 시간 (대기열에서 대기하는 것처럼)
      const queueWaitTime = this.getRandomDelay(3000, 5000);
      await this.sleep(queueWaitTime);

      // 2단계: 티켓팅 시작
      // 대기열에서 제거
      await getOutQueue(bot.nickname);

      // 좌석 선택 전 대기 시간
      const selectDelay = this.getRandomDelay(
        this.config.minSeatSelectDelay,
        this.config.maxSeatSelectDelay
      );
      await this.sleep(selectDelay);

      // 3단계: 좌석 조회 및 선택
      const seats = await getAllSeats();
      const availableSeats = Object.entries(seats)
        .filter(([_, state]) => state === "available")
        .map(([seatId]) => seatId);
      // 예매 가능한 좌석이 없으면 봇 종료(좌석 전부 lock 상태)
      if (availableSeats.length === 0) {
        console.log(`예매 가능한 좌석이 없습니다.(봇 종료): ${bot.nickname}`);
        this.bots.delete(bot.botId);
        return;
      }

      // 랜덤 좌석 선택
      const randomSeatId =
        availableSeats[Math.floor(Math.random() * availableSeats.length)];

      console.log(`봇 ${bot.nickname} 좌석 선택: ${randomSeatId}`);

      // 4단계: 예매 확정
      try {
       await botBookingConfirmation(randomSeatId);
        console.log(
          `봇 ${bot.nickname} 예매 성공: 좌석: ${randomSeatId}`
        );
      } catch (error) {
        // 다른 봇 또는 사용자가 예매를 먼저 했을 경우 에러 처리
        console.log(
          `봇 ${bot.nickname} 예매 실패: ${error.message}, 다른 좌석 시도`
        );

        // 다른 좌석 시도 (최대 5번)
        let retryCount = 0;
        const maxRetries = 5;

        while (retryCount < maxRetries && availableSeats.length > 0) {
          retryCount++;
          const nextSeatId =
            availableSeats[Math.floor(Math.random() * availableSeats.length)];

          try {
            const result = await processBookingConfirmation(nextSeatId);
            console.log(
              `봇 ${bot.nickname} 예매 성공: 좌석: ${nextSeatId}, 소요시간: ${result.duration}초 (재시도 ${retryCount})`
            );
            break;
          } catch (retryError) {
            if (retryCount === maxRetries) {
              console.log(`봇 ${bot.nickname} 예매 실패: 모든 시도 실패`);
            }
          }
        }
      }

      // 사이클 완료 후 봇 제거
      this.bots.delete(bot.botId);
    } catch (error) {
      console.error(`봇 ${bot.nickname} 사이클 실행 오류:`, error.message);
      this.bots.delete(bot.botId);
    }
  }

  // 봇 상태 조회
  getStatus() {
    return {
      isEnabled: this.isEnabled,
      activeBots: this.bots.size,
      botList: Array.from(this.bots.values()).map((bot) => ({
        botId: bot.botId,
        nickname: bot.nickname,
        isActive: bot.isActive,
      })),
      config: this.config,
    };
  }

  // 무작위 지연 시간 생성 (ms)
  getRandomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // 비동기 대기 (ms)
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// 싱글톤 인스턴스
export const botManager = new BotManager();
