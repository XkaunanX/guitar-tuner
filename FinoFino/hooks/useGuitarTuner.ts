import { useEffect, useState } from "react"
import { Alert, PermissionsAndroid, Platform } from "react-native"
import { PitchDetector } from "react-native-pitch-detector"

const guitarStrings = [
  { name: "E", frequency: 82.41, string: "6 (E grave)" },
  { name: "A", frequency: 110.0, string: "5 (A)" },
  { name: "D", frequency: 146.83, string: "4 (D)" },
  { name: "G", frequency: 196.0, string: "3 (G)" },
  { name: "B", frequency: 246.94, string: "2 (B)" },
  { name: "E", frequency: 329.63, string: "1 (E agudo)" },
]

async function requestAudioPermission() {
  if (Platform.OS === "android") {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: "Permiso de Microfono",
        message: "La app necesita acceso al microfono para detectar el tono",
        buttonNeutral: "Preguntarme despues",
        buttonNegative: "Cancelar",
        buttonPositive: "Aceptar",
      }
    )
    return granted === PermissionsAndroid.RESULTS.GRANTED
  }
  return true
}

export function useGuitarTuner() {
  const [targetString, setTargetString] = useState(guitarStrings[0])
  const [isListening, setIsListening] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [detectedFrequency, setDetectedFrequency] = useState<number | null>(null)
  const [detectedTone, setDetectedTone] = useState<string | null>(null)

  const targetNote = targetString.name
  const targetFrequency = targetString.frequency

  const getTuningAccuracy = (detected: number, target: number): number => {
    if (!detected || !target) return 0
    return 1200 * Math.log2(detected / target)
  }

  const tuningAccuracy =
    detectedFrequency && targetFrequency
      ? getTuningAccuracy(detectedFrequency, targetFrequency)
      : 0

  const handleStringSelect = (stringLabel: string) => {
    const selected = guitarStrings.find(s => s.string === stringLabel)
    if (selected) setTargetString(selected)
  }

  const startListening = async () => {
    const hasPermission = await requestAudioPermission()
    if (!hasPermission) {
      Alert.alert("Permiso denegado para usar el microfono")
      return
    }

    PitchDetector.addListener(({ frequency, tone }) => {
      setDetectedFrequency(frequency)
      setDetectedTone(tone)
    })

    try {
      await PitchDetector.start()
      setIsListening(true)
    } catch (error) {
      Alert.alert("Error al iniciar la detección de tono")
    }
  }

  const stopListening = async () => {
    await PitchDetector.stop()
    PitchDetector.removeListener()
    setIsListening(false)
    setDetectedFrequency(null)
    setDetectedTone(null)
  }

  const toggleListening = () => {
    isListening ? stopListening() : startListening()
  }

  const toggleMute = () => {
    setIsMuted(prev => !prev)
  }

  useEffect(() => {
    return () => {
      PitchDetector.stop()
      PitchDetector.removeListener()
    }
  }, [])

  return {
    guitarStrings,
    targetString,
    targetNote,
    targetFrequency,
    tuningAccuracy,
    detectedFrequency,
    detectedTone,
    isListening,
    isMuted,
    toggleMute,
    toggleListening,
    handleStringSelect,
  }
}
