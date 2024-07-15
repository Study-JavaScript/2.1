import { debounce } from './app';

const mockFunc = jest.fn();

jest.useFakeTimers();

describe('debounce function', () => {
  it('should debounce function calls', () => {

    const debouncedFunc = debounce(mockFunc, 1000);

    
    debouncedFunc();

    
    expect(mockFunc).not.toHaveBeenCalled();

    
    jest.advanceTimersByTime(500);

    
    expect(mockFunc).not.toHaveBeenCalled();

    
    jest.advanceTimersByTime(500);

    
    expect(mockFunc).toHaveBeenCalledTimes(1);

    
  });

  it('should debounce multiple calls', () => {
    const debouncedFunc = debounce(mockFunc, 1000);

    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    
    jest.advanceTimersByTime(500);

    
    expect(mockFunc).toHaveBeenCalledTimes(1);
  });
});