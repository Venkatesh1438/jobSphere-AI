import { useEffect, useState } from 'react'
import { animate } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  duration?: number
}

export default function AnimatedCounter({ value, duration = 0.8 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // Reset back to 0 if the value changes to start a new count animation
    setCount(0)
    
    const controls = animate(0, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => setCount(Math.floor(latest)),
    })
    
    return () => controls.stop()
  }, [value, duration])

  return <span>{count}</span>
}
