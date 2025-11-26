import { saveRecord, calculateRankPercentile } from "../models/recordModel.js";

export async function processBookingConfirmation(duration) {
  const savedRecord = await saveRecord(duration);

  const rankingPercent = await calculateRankPercentile(duration);

  return {
    recordId: savedRecord.id,
    duration: savedRecord.duration,
    rankingPercent: rankingPercent,
    createdAt: savedRecord.created_at,
  };
}
