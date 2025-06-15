import { useEffect, useState } from "react"

export function useTuningStatus(
  detectedFrequency: number,
  targetFrequency: number,
  isListening: boolean,
  toleranceHz: number = 1.0
) {
  const [statusText, setStatusText] = useState("Esperando...")
  const [statusColor, setStatusColor] = useState("#94A3B8") // slate-400
  const [isInTune, setIsInTune] = useState(false)

  useEffect(() => {
    if (!isListening || targetFrequency === 0 || detectedFrequency === 0) {
      setStatusText("Esperando...")
      setStatusColor("#94A3B8")
      setIsInTune(false)
      return
    }

    const diff = detectedFrequency - targetFrequency

    if (Math.abs(diff) <= toleranceHz) {
      setStatusText("¡Afinado!")
      setStatusColor("#4ADE80") // green-400
      setIsInTune(true)
    } else if (diff < 0) {
      setStatusText("Demasiado bajo")
      setStatusColor("#FBBF24") // amber-400
      setIsInTune(false)
    } else {
      setStatusText("Demasiado alto")
      setStatusColor("#FBBF24") // amber-400
      setIsInTune(false)
    }
  }, [detectedFrequency, targetFrequency, isListening, toleranceHz])

  return { statusText, statusColor, isInTune }
}
