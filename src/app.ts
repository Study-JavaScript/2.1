// export function debounce<DebounceFunction extends (...args: any[])=>void>(func:DebounceFunction, wait: number): (...args: Parameters<DebounceFunction>)=>void{
//     let timeout: ReturnType<typeof setTimeout>;
//     return function(this:unknown, ...args: Parameters<DebounceFunction>){
        
//         clearTimeout(timeout);
//         timeout = setTimeout(() =>{
//             func.apply(this, args);
        
//         }, wait);
//     };

// }




export function debounce<Args extends any[]>(callback: (...args: Args) => void, wait: number): (...args: Args) => void {
    let timerId: ReturnType<typeof setTimeout>;
    return (...args: Args) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        callback(...args);
      }, wait);
    };
  }