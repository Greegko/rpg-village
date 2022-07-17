import { useEffect, useState } from "react";

export function useValue<T>(calculator: () => T, deps: any[] = [], defaultValue: T): T {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => setValue(calculator()), deps);

  return value;
}
