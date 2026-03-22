// Copied from lab muyang-vt26-native.
// Resolves a promise and writes result/error into a reactive promiseState object.
// The stale-promise check (promiseState.promise !== prms) prevents
// race conditions when a new request fires before the previous one resolves.

export function resolvePromise(prms, promiseState) {
  promiseState.promise = prms;
  promiseState.data = null;
  promiseState.error = null;
  if (prms === null || prms === undefined) return;

  prms.then(gotDataACB).catch(gotErrorACB);

  function gotDataACB(data) {
    if (promiseState.promise !== prms) return;
    promiseState.data = data;
  }

  function gotErrorACB(error) {
    if (promiseState.promise !== prms) return;
    promiseState.error = error;
  }
}
