// higher-order function for async/await error handling 
// takes an async fn as a param, returns a fn 
 export const catchErrors = fn => {
  return function(...args) {
    return fn(...args).catch((err) => {
      console.error(err);
    })
  }
}