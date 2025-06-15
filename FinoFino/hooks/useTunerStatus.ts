import { useEffect, useRef, useState } from "react"
import { Animated } from "react-native"

export function useTunerStatus(tuningAccuracy: number, isListening: boolean) {
  const clampedAccuracy = Math.max(-50, Math.min(50, tuningAccuracy))
  const rotationValue = useRef(new Animated.Value(clampedAccuracy)).current

  const [statusText, setStatusText] = useState("Esperando...")
  const [statusColor, setStatusColor] = useState("#94A3B8")

  useEffect(() => {
    Animated.spring(rotationValue, {
      toValue: clampedAccuracy,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start()
  }, [clampedAccuracy])

  useEffect(() => {
    if (!isListening) {
      setStatusText("Esperando...")
      setStatusColor("#94A3B8")
    } else if (Math.abs(tuningAccuracy) < 5) {
      setStatusText("¡Afinado!")
      setStatusColor("#4ADE80")
    } else if (tuningAccuracy < 0) {
      setStatusText("Demasiado bajo")
      setStatusColor("#FBBF24")
    } else {
      setStatusText("Demasiado alto")
      setStatusColor("#FBBF24")
    }
  }, [tuningAccuracy, isListening])

  const rotate = rotationValue.interpolate({
    inputRange: [-50, 0, 50],
    outputRange: ["-45deg", "0deg", "45deg"],
    extrapolate: "clamp",
  })

  return { rotate, statusText, statusColor }
}
