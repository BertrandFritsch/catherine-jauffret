import { useRef } from 'react'
import { useOutlet } from 'react-router'

export function AnimatedOutlet() {
	const { current: outlet } = useRef(useOutlet())

	return outlet
}
