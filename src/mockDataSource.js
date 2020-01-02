export function startMockDataSource(emitter, dateRange = [500, 700], timeRange = [100, 200]) {
  let timeoutId;

  timeout();

  return () => clearTimeout(timeoutId);

  function timeout() {
    const time = getRandomArbitrary(...timeRange);
    const value = getRandomArbitrary(...dateRange);

    emitter.emit('data', value);

    timeoutId = setTimeout(() => timeout(), time);
  }

  function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
}
