import { useEffect, useState } from 'react'
import { Alert, PermissionsAndroid, Platform } from 'react-native'
import { PitchDetector } from 'react-native-pitch-detector'

export function usePitchDetection() {
  const [frequency, setFrequency] = useState<number | null>(null)
  const [tone, setTone] = useState<string | null>(null)
  const [isListening, setIsListening] = useState(false)

  const requestAudioPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Permiso de Microfono',
          message: 'La app necesita acceso al microfono para detectar el tono',
          buttonNeutral: 'Preguntarme despues',
          buttonNegative: 'Cancelar',
          buttonPositive: 'Aceptar',
        }
      )
      return granted === PermissionsAndroid.RESULTS.GRANTED
    }
    return true
  }

  const start = async () => {
    const hasPermission = await requestAudioPermission()
    if (!hasPermission) {
      Alert.alert('Permiso denegado para usar el microfono')
      return
    }

    PitchDetector.addListener(({ frequency, tone }) => {
      console.log('Frecuencia:', frequency, 'Tono:', tone)
      setFrequency(frequency)
      setTone(tone)
    })

    try {
      await PitchDetector.start()
      setIsListening(true)
    } catch {
      Alert.alert('Error al iniciar la detección de tono')
    }
  }

  const stop = async () => {
    await PitchDetector.stop()
    PitchDetector.removeListener()
    setIsListening(false)
    setFrequency(null)
    setTone(null)
  }

  useEffect(() => {
    return () => {
      stop()
    }
  }, [])

  return {
    frequency,
    tone,
    isListening,
    start,
    stop
  }
}