import {createMonitorSource} from './monitorSource';
import {EventEmitter} from 'events';

test('Display object should not be emitted more often than every 100ms', done => {
  testMonitorSource(done, [
    [[1, 100], [4, 400], [7]],
    [[2, 200], [5, 500], [8]],
    [[3, 300], [6, 1200], [9]]
  ], [
    [1, 2, 3],
    [7, 8, 9]
  ], {
    minInterval: 1000, // slow down 10 times
    maxDelay: 10000
  });
});

test('Display object should only be emitted when one of the systems sends a new value', done => {
  testMonitorSource(done, [
    [[1, 100]],
    [[2, 300]],
    [[3, 500], [3, 200], [4]]
  ], [
    [1, 2, 3],
    [1, 2, 4]
  ]);
});

test('If a value is not received from a specific system for more than 1000ms, its reading (in the display object) should be \'N/A\'', done => {
  testMonitorSource(done, [
    [[1, 700], [4]],
    [[2, 800], [5]],
    [[3, 1500], [6]]
  ], [
    [1, 2, 3],
    [4, 2, 3],
    [4, 5, 3],
    [4, 5, 'N/A'],
    [4, 5, 6],
  ], {
    minInterval: 0
  });
});

test('All 3 systems must emit at least one value before 1 display object is ever sent to the dashboard', done => {
  testMonitorSource(done, [
    [[1, 100]],
    [[2, 300]],
    [[3, 500], [4]]
  ], [
    [1, 2, 3],
    [1, 2, 4]
  ]);
});

function testMonitorSource(done, sourcesData, result, options) {
  const sources = sourcesData.map(mock => startMockEmitter(mock));
  let index = 0;
  const sub = createMonitorSource(sources, options).subscribe(value => {
    expect(value).toEqual(result[index]);
    index++;
    if (index === result.length) {
      sub.unsubscribe();
      done();
    }
  });
}

function startMockEmitter(data) {
  let index = 0;
  const emitter = new EventEmitter();
  setTimeout(() => timer());
  return emitter;

  function timer() {
    emitter.emit('data', data[index][0]);

    if (index === data.length - 1) {
      return;
    }

    setTimeout(() => {
      timer();
    }, data[index][1]);

    index++;
  }
}
