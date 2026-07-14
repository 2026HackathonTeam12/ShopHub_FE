import { createContext, useContext, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

/**
 * Creates a paired value/setter context with a self-contained Provider and
 * three hook variants:
 * - `useValue()` — read the current value.
 * - `useSetValue()` — get the setter.
 * - `useValueState()` — get both as a `[value, setValue]` tuple.
 */
export function createStateContext<T>(defaultValue: T) {
  const Context = createContext<T>(defaultValue);
  const SetContext = createContext<Dispatch<SetStateAction<T>>>(() => {});

  function Provider({ children }: { children: ReactNode }) {
    const [value, setValue] = useState<T>(defaultValue);
    return (
      <Context value={value}>
        <SetContext value={setValue}>{children}</SetContext>
      </Context>
    );
  }

  function useValue(): T {
    return useContext(Context);
  }

  function useSetValue(): Dispatch<SetStateAction<T>> {
    return useContext(SetContext);
  }

  function useValueState(): [T, Dispatch<SetStateAction<T>>] {
    return [useContext(Context), useContext(SetContext)];
  }

  return { Provider, useValue, useSetValue, useValueState };
}
