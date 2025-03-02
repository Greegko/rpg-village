export const pairwise = <T>(fn: (x: T | null, y: T) => void) => {
  let lastArg: T | null = null;

  return (arg: T) => {
    const previousArg = lastArg;
    lastArg = arg;

    return fn(previousArg, arg);
  };
};
