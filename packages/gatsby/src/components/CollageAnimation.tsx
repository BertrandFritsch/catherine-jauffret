import { globalHistory } from '@reach/router';
import { navigate } from 'gatsby';
import * as React from 'react';
import { isCollagesPage, noop } from '../helpers';

type StateType = 'NONE' | 'STARTING' | 'ANIMATING_IN' | 'READY' | 'ANIMATING_OUT' | 'ENDING';

type State =
    { type: 'NONE' }
  | { type: Exclude<StateType, 'NONE'>, pathname: string, rect: DOMRect, animationCounter: number };

type Transition =
    { type: 'SHOW_COLLAGE', pathname: string, rect: DOMRect }
  | { type: 'START_ANIMATING' }
  | { type: 'STOP_ANIMATING' }
  | { type: 'NAVIGATION_POP', pathname: string }
  | { type: 'NAVIGATION_PUSH', pathname: string }
  | { type: 'END' };

interface CollageContextValue {
  state: State;

  showCollage: (pathname: string, rect: DOMRect) => void;
  startAnimating: () => void;
  stopAnimating: () => void;
}

function reducer(state: State, transition: Transition): State {
  // console.log('Transition:', { type: transition.type, state });
  switch (transition.type) {
    case 'SHOW_COLLAGE':
      switch (state.type) {
        case 'NONE':
          return { type: 'STARTING', pathname: transition.pathname, rect: transition.rect, animationCounter: 0 };

        case 'STARTING':
        case 'ANIMATING_IN':
        case 'READY':
        case 'ANIMATING_OUT':
        case 'ENDING':
          throw new Error(`Collage animation transition error: ${ JSON.stringify({ state, transition }) }`);
      }
      break;

    case 'START_ANIMATING':
      switch (state.type) {
        case 'NONE':
        case 'READY':
          return state;

        case 'STARTING':
          return { ...state, type: 'ANIMATING_IN', animationCounter: state.animationCounter + 1 };

        case 'ANIMATING_IN':
        case 'ANIMATING_OUT':
          return { ...state, animationCounter: state.animationCounter + 1 };

        case 'ENDING':
          throw new Error(`Collage animation transition error: ${ JSON.stringify({ state, transition }) }`);
      }
      break;

    case 'NAVIGATION_POP':
      switch (state.type) {
        case 'NONE':
          return state;

        case 'STARTING':
        case 'ANIMATING_IN':
        case 'READY':
          if (isCollagesPage(transition.pathname)) {
            return { ...state, type: 'ANIMATING_OUT', animationCounter: state.type === 'ANIMATING_IN' ? state.animationCounter - 1 : state.animationCounter };
          }

          if (transition.pathname === state.pathname) {
            return state;
          }

          return { type: 'NONE' };

        case 'ENDING':
        case 'ANIMATING_OUT':
          if (transition.pathname === state.pathname) {
            return { ...state, type: 'ANIMATING_IN', animationCounter: state.type === 'ANIMATING_OUT' ? state.animationCounter + 1 : state.animationCounter };
          }

          if (isCollagesPage(transition.pathname)) {
            return state;
          }

          return { type: 'NONE' };
      }
      break;

    case 'NAVIGATION_PUSH':
      switch (state.type) {
        case 'NONE':
        case 'STARTING':
          return state;

        case 'ANIMATING_IN':
        case 'READY':
        case 'ANIMATING_OUT':
        case 'ENDING':
          return { type: 'NONE' };
      }
      break;

    case 'STOP_ANIMATING':
      switch (state.type) {
        case 'NONE':
        case 'READY':
        case 'ENDING':
          return state;

        case 'ANIMATING_IN':
          return state.animationCounter === 1
            ? { ...state, type: 'READY', animationCounter: 0 }
            : { ...state, animationCounter: state.animationCounter - 1 };

        case 'ANIMATING_OUT':
          return state.animationCounter === 1
                 ? { ...state, type: 'ENDING', animationCounter: 0 }
                 : { ...state, animationCounter: state.animationCounter - 1 };

        case 'STARTING':
          throw new Error(`Collage animation transition error: ${ JSON.stringify({ state, transition }) }`);
      }
      break;

    case 'END':
      switch (state.type)  {
        case 'NONE':
        case 'STARTING':
        case 'ANIMATING_IN':
        case 'READY':
        case 'ANIMATING_OUT':
          throw new Error(`Collage animation transition error: ${ JSON.stringify({ state, transition }) }`);

        case 'ENDING':
          return { type: 'NONE' };
      }
      break;
  }
}

export const CollageContext = React.createContext<CollageContextValue>({
  state: { type: 'NONE' },
  showCollage: noop,
  startAnimating: noop,
  stopAnimating: noop
});

interface Props {
  children: React.ReactNode;
}

export default function CollageAnimation({ children }: Props) {
  const [ state, dispatch ] = React.useReducer(reducer, { type: 'NONE' });

  const value = React.useMemo<CollageContextValue>(
    () => {
      return {
        state,
        showCollage: (pathname, rect) => dispatch({ type: 'SHOW_COLLAGE', pathname, rect }),
        startAnimating: () => dispatch({ type: 'START_ANIMATING' }),
        stopAnimating: () => dispatch({ type: 'STOP_ANIMATING' })
      }
    },
    [ state ]
  );

  React.useEffect(
    () => {
      // console.log('State:', state);
      switch (state.type) {
        case 'STARTING':
          navigate(state.pathname);
          break;

        case 'ANIMATING_IN': {
          const sbWidth = window.innerWidth - document.documentElement.getBoundingClientRect().width;
          document.documentElement.style.cssText = `overflow: hidden; margin-right: ${ sbWidth }px`;
          break;
        }

        case 'ANIMATING_OUT':
        case 'NONE':
          document.documentElement.style.cssText = '';
          break;

        case 'ENDING':
          dispatch({ type: 'END' });
          break;
      }
    },
    [ state ]
  );

  React.useEffect(
    () =>
      // listen to the kind of navigation to only animate the exit state when going back to the /collages page
      globalHistory.listen(({ action, location }) => {
        if (action === 'POP') {
          dispatch({ type: 'NAVIGATION_POP', pathname: location.pathname });
        }
        else {
          dispatch({ type: 'NAVIGATION_PUSH', pathname: location.pathname });
        }
      }),
    []
  );

  return (
    <CollageContext.Provider value={ value }>
      { children }
    </CollageContext.Provider>
  );
}
