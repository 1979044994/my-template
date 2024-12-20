
function useDebounce(fn: () => void, delay = 500) {
  let timer: string | number | NodeJS.Timeout | undefined;

  const debouncedFn = () => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      fn();
    }, delay);
  };

  return debouncedFn;
}

export default useDebounce;
