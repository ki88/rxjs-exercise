import {fromEvent, merge, of, timer} from 'rxjs';
import {filter, map, scan, switchMap, throttleTime, distinctUntilChanged} from 'rxjs/operators';

export function createMonitorSource(emitters, opts = {}) {
  const {minInterval = 100, maxDelay = 1000} = opts;
  let ready = false;
  return merge(
    ...emitters.map((emitter, index) => fromEvent(emitter, 'data').pipe(
      distinctUntilChanged(),
      switchMap(value => merge(
        of(value),
        timer(maxDelay).pipe(
          map(() => 'N/A')
        )
      )),
      map(value => ({
        index,
        value
      }))
    ))
  ).pipe(
    scan((acc, {index, value}) => {
      const res = [...acc];
      res[index] = value;
      return res;
    }, Array(emitters.length)),
    filter(value => ready || (ready = value.findIndex(item => typeof item === 'undefined') === -1)),
    throttleTime(minInterval),
)
}
