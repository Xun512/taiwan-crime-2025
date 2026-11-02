const EXPLORER_MATH = Object.freeze({
  value(count, denominator, metric) {
    if (metric === 'count') return count;
    if (!Number.isFinite(denominator) || denominator <= 0) return null;
    return count / denominator * (metric === 'rate' ? 100000 : 100);
  },
  difference(a, b) {
    if (a === null || b === null) return { absolute: null, relative: null, ratio: null };
    return { absolute: b - a, relative: a === 0 ? null : (b - a) / a * 100, ratio: a === 0 ? null : b / a };
  }
});
