import { useCallback, useRef, useState } from 'react'
import { asserts } from '#app/shared/utils'

export type DerivedStateFromPropsDispatch<S> = (
  state: S | ((state: S) => S),
) => void

/**
 * `useDerivedStateFromProps` is a custom hook that allows you to derive state from props in a function component.
 * It's similar to `getDerivedStateFromProps` lifecycle method in a class component.
 *
 * @param getNextState - A function that takes the current state or null and returns the next state.
 *
 * @returns A tuple where the first item is the current state and the second item is a dispatch function to update the state.
 *
 * @example
 * const [state, setState] = useDerivedStateFromProps(nextState => nextState || initialState);
 *
 * @template S - The type of the state.
 */
export function useDerivedStateFromProps<S>(
  getNextState: (state: S | null) => S,
): readonly [S, DerivedStateFromPropsDispatch<S>] {
  const stateRef = useRef<S | null>(null)
  stateRef.current = getNextState(stateRef.current)

  const [, triggerUpdate] = useState(false)

  const setState: DerivedStateFromPropsDispatch<S> = useCallback((state) => {
    asserts(stateRef.current !== null, 'State must be initialized')
    const nextState =
      state instanceof Function ? state(stateRef.current) : state

    if (stateRef.current !== nextState) {
      stateRef.current = nextState
      triggerUpdate((s) => !s)
    }
  }, [])

  return [stateRef.current, setState]
}
