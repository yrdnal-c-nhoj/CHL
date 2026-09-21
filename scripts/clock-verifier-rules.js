export function hasIndependentClockTiming(source) {
  const hasDirectRaf = /requestAnimationFrame\s*\(/.test(source);
  if (!hasDirectRaf) return false;

  const hasClockTimeCalculation =
    /(?:Date\.now|new\s+Date\s*\(|performance\.now)\s*\(/.test(source) ||
    /(?:setHours|setMinutes|setSeconds|setMilliseconds)\s*\(/.test(source);

  const hasThreeRenderLoop =
    /renderer\.render\s*\(/.test(source) && /from ['"]three['"]/.test(source);

  return hasClockTimeCalculation && !hasThreeRenderLoop;
}
