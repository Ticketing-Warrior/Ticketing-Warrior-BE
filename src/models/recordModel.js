import { AppDataSource } from "../config/dataConfig.js";
import { Record } from "../entities/Record.js";

const recordRepository = AppDataSource.getRepository(Record);

// 기록 저장 함수
export async function saveRecord(duration) {
  const newRecord = recordRepository.create({
    duration: duration,
  });
  return await recordRepository.save(newRecord);
}

// 상위 퍼센트 계산 함수
export async function calculateRankPercentile(myDuration) {
  const totalCount = await recordRepository.count();

  if (totalCount === 0) return 0;

  // 나보다 빠르거나(시간이 작거나) 같은 기록의 수 조회
  // QueryBuilder를 사용하여 조건부 카운트 실행
  const fasterOrEqualCount = await recordRepository
    .createQueryBuilder("record")
    .where("record.duration <= :myDuration", { myDuration })
    .getCount();

  // 상위 퍼센트 계산
  const percentile = (fasterOrEqualCount / totalCount) * 100;

  return parseFloat(percentile.toFixed(2));
}
