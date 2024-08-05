export const log = (message?: any, ...optionalParams: any[]) => {
  if (process.env.DEV_MODE === "local") {
    console.log(message, ...optionalParams);
  }
};
