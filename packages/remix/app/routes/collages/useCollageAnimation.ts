import { useCallback, useLayoutEffect, useReducer } from 'react'
import { useLocation, useNavigationType } from 'react-router'
import { isCollagesPage } from './helpers'

type StateType =
	| 'NONE'
	| 'STARTING'
	| 'ANIMATING_IN'
	| 'READY'
	| 'ANIMATING_OUT'
	| 'ENDING'

type State =
	| { type: 'NONE' }
	| {
			type: Exclude<StateType, 'NONE'>
			pathname: string
			rect: DOMRect
			animationCounter: number
	  }

type Transition =
	| { type: 'SHOW_COLLAGE'; pathname: string; rect: DOMRect }
	| { type: 'START_ANIMATING' }
	| { type: 'STOP_ANIMATING' }
	| { type: 'NAVIGATION_POP'; pathname: string }
	| { type: 'NAVIGATION_PUSH'; pathname: string }
	| { type: 'END' }

function collageAnimationReducer(state: State, transition: Transition): State {
	switch (transition.type) {
		case 'SHOW_COLLAGE':
			switch (state.type) {
				case 'NONE':
					return {
						type: 'STARTING',
						pathname: transition.pathname,
						rect: transition.rect,
						animationCounter: 0,
					}

				case 'STARTING':
				case 'ANIMATING_IN':
				case 'READY':
				case 'ANIMATING_OUT':
				case 'ENDING':
					throw new Error(
						`Collage animation transition error: ${JSON.stringify({ state, transition })}`,
					)
			}
			break

		case 'START_ANIMATING':
			switch (state.type) {
				case 'NONE':
				case 'READY':
					return state

				case 'STARTING':
					return {
						...state,
						type: 'ANIMATING_IN',
						animationCounter: state.animationCounter + 1,
					}

				case 'ANIMATING_IN':
				case 'ANIMATING_OUT':
					return { ...state, animationCounter: state.animationCounter + 1 }

				case 'ENDING':
					throw new Error(
						`Collage animation transition error: ${JSON.stringify({ state, transition })}`,
					)
			}
			break

		case 'NAVIGATION_POP':
			switch (state.type) {
				case 'NONE':
					return state

				case 'STARTING':
				case 'ANIMATING_IN':
				case 'READY':
					if (isCollagesPage(transition.pathname)) {
						return {
							...state,
							type: 'ANIMATING_OUT',
							animationCounter:
								state.type === 'ANIMATING_IN'
									? state.animationCounter - 1
									: state.animationCounter,
						}
					}

					if (transition.pathname === state.pathname) {
						return state
					}

					return { type: 'NONE' }

				case 'ENDING':
				case 'ANIMATING_OUT':
					if (transition.pathname === state.pathname) {
						return {
							...state,
							type: 'ANIMATING_IN',
							animationCounter:
								state.type === 'ANIMATING_OUT'
									? state.animationCounter + 1
									: state.animationCounter,
						}
					}

					if (isCollagesPage(transition.pathname)) {
						return state
					}

					return { type: 'NONE' }
			}
			break

		case 'NAVIGATION_PUSH':
			switch (state.type) {
				case 'NONE':
				case 'STARTING':
					return state

				case 'ANIMATING_IN':
				case 'READY':
				case 'ANIMATING_OUT':
				case 'ENDING':
					return { type: 'NONE' }
			}
			break

		case 'STOP_ANIMATING':
			switch (state.type) {
				case 'NONE':
				case 'READY':
				case 'ENDING':
					return state

				case 'ANIMATING_IN':
					return state.animationCounter === 1
						? { ...state, type: 'READY', animationCounter: 0 }
						: { ...state, animationCounter: state.animationCounter - 1 }

				case 'ANIMATING_OUT':
					return state.animationCounter === 1
						? { ...state, type: 'ENDING', animationCounter: 0 }
						: { ...state, animationCounter: state.animationCounter - 1 }

				case 'STARTING':
					throw new Error(
						`Collage animation transition error: ${JSON.stringify({ state, transition })}`,
					)
			}
			break

		case 'END':
			switch (state.type) {
				case 'NONE':
				case 'STARTING':
				case 'ANIMATING_IN':
				case 'READY':
				case 'ANIMATING_OUT':
					throw new Error(
						`Collage animation transition error: ${JSON.stringify({ state, transition })}`,
					)

				case 'ENDING':
					return { type: 'NONE' }
			}
			break
	}
}

export function useCollageAnimation() {
	const [state, dispatch] = useReducer(collageAnimationReducer, {
		type: 'NONE',
	})
	const navigationType = useNavigationType()
	const { pathname } = useLocation()

	const showCollage = useCallback(
		(rect: DOMRect) => {
			dispatch({ type: 'SHOW_COLLAGE', pathname, rect })
		},
		[pathname],
	)

	const startAnimating = useCallback(() => {
		dispatch({ type: 'START_ANIMATING' })
	}, [])

	const stopAnimating = useCallback(() => {
		dispatch({ type: 'STOP_ANIMATING' })
	}, [])

	const end = useCallback(() => {
		dispatch({ type: 'END' })
	}, [])

	useLayoutEffect(() => {
		switch (state.type) {
			case 'ENDING':
				dispatch({ type: 'END' })
				break
		}
	}, [state])

	useLayoutEffect(() => {
		// listen to the kind of navigation to only animate the exit state when going back to the /collages page
		if (navigationType === 'POP') {
			dispatch({ type: 'NAVIGATION_POP', pathname })
		} else {
			dispatch({ type: 'NAVIGATION_PUSH', pathname })
		}
	}, [navigationType, pathname])

	return { state, showCollage, startAnimating, stopAnimating, end }
}
