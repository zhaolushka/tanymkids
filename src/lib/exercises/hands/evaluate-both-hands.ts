import { kk } from "@/i18n/kk";
import type { EvaluationResult, Landmark } from "@/types/exercise";

type SingleHandEvaluator = (landmarks: Landmark[]) => EvaluationResult;

export function evaluateBothHands(
  hands: Landmark[][],
  evaluateSingle: SingleHandEvaluator,
): EvaluationResult {
  if (hands.length === 0) {
    return {
      success: false,
      accuracy: 0,
      hint: kk.hands.hints.showBoth,
    };
  }

  const results = hands.map(evaluateSingle);
  const successCount = results.filter((result) => result.success).length;

  if (hands.length === 1) {
    if (results[0].success) {
      return {
        success: false,
        accuracy: 0.55,
        partial: true,
        hint: kk.hands.hints.oneHandOk,
      };
    }
    return {
      ...results[0],
      hint: results[0].hint ?? kk.hands.hints.bothDo,
    };
  }

  if (successCount === hands.length) {
    return { success: true, accuracy: 1 };
  }

  if (successCount > 0) {
    return {
      success: false,
      accuracy: successCount / hands.length,
      partial: true,
      hint: kk.hands.hints.secondHand,
    };
  }

  const bestHint = results.find((result) => result.hint)?.hint;
  return {
    success: false,
    accuracy: 0.1,
    hint: bestHint ?? kk.hands.hints.bothDo,
  };
}
