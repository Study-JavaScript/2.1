export function debounce<Args extends any[]>(callback: (...args: Args) => void, wait: number): (...args: Args) => void {
    let timerId: ReturnType<typeof setTimeout>;
    return (...args: Args) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        callback(...args);
      }, wait);
    };
  }