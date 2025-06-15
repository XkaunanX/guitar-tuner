import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  PermissionsAndroid,
  Platform,
} from 'react-native'
import { Guitar, Mic, MicOff, Volume2, VolumeX } from 'lucide-react-native'
import { PitchDetector } from 'react-native-pitch-detector'

import TunerDisplay from '../components/TunerDisplay'
import StringSelector from '../components/StringSelector'

const guitarStrings = [
  { name: "E", frequency: 82.41, string: "6 (E grave)" },
  { name: "A", frequency: 110.0, string: "5 (A)" },
  { name: "D", frequency: 146.83, string: "4 (D)" },
  { name: "G", frequency: 196.0, string: "3 (G)" },
  { name: "B", frequency: 246.94, string: "2 (B)" },
  { name: "E", frequency: 329.63, string: "1 (E agudo)" },
]

async function requestAudioPermission() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Permiso de Microfono',
        message: 'La app necesita acceso al microfono para detectar el tono',
        buttonNeutral: 'Preguntarme despues',
        buttonNegative: 'Cancelar',
        buttonPositive: 'Aceptar',
      },
    )
    return granted === PermissionsAndroid.RESULTS.GRANTED
  }
  return true
}

export default function GuitarTunerScreen() {
  const [targetString, setTargetString] = useState(guitarStrings[0])
  const [isListening, setIsListening] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [detectedFrequency, setDetectedFrequency] = useState<number | null>(null)
  const [detectedTone, setDetectedTone] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      PitchDetector.stop()
      PitchDetector.removeListener()
    }
  }, [])

  const startListening = async () => {
    const hasPermission = await requestAudioPermission()
    if (!hasPermission) {
      Alert.alert('Permiso denegado para usar el microfono')
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
      Alert.alert('Error al iniciar la detección de tono')
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
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleStringSelect = (stringLabel: string) => {
    const selected = guitarStrings.find(s => s.string === stringLabel)
    if (selected) setTargetString(selected)
  }

  const targetNote = targetString.name
  const targetFrequency = targetString.frequency

  const getTuningAccuracy = (detected: number, target: number): number => {
    if (!detected || !target) return 0
    return 1200 * Math.log2(detected / target)
  }

  const tuningAccuracy = detectedFrequency && targetFrequency
    ? getTuningAccuracy(detectedFrequency, targetFrequency)
    : 0

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        <Guitar color="white" size={28} /> Afinador de Guitarra
      </Text>

      <View style={styles.card}>
        <TunerDisplay
          currentNote={detectedTone || targetNote}
          targetNote={targetNote}
          tuningAccuracy={tuningAccuracy}
          frequency={detectedFrequency || 0}
          isListening={isListening}
        />

        <StringSelector
          strings={guitarStrings}
          currentString={targetString.string}
          onSelectString={handleStringSelect}
        />

        <View style={styles.controls}>
          <TouchableOpacity
            onPress={toggleListening}
            style={[styles.listenButton, isListening ? styles.stopButton : styles.startButton]}
          >
            {isListening ? <MicOff color="white" size={20} /> : <Mic color="white" size={20} />}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleMute}
            style={styles.muteButton}
            disabled={!isListening}
          >
            {isMuted ? <VolumeX color="white" size={20} /> : <Volume2 color="white" size={20} />}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>Toca una cuerda y ajustala hasta que la aguja este centrada</Text>
        <Text style={styles.instructionText}>Selecciona la cuerda que deseas afinar</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#0f172a',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 40
  },
  card: {
    width: '100%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginTop: 24
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 24
  },
  listenButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center'
  },
  startButton: {
    backgroundColor: '#10b981'
  },
  stopButton: {
    backgroundColor: '#ef4444'
  },
  muteButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16
  },
  instructions: {
    marginTop: 24,
    alignItems: 'center'
  },
  instructionText: {
    color: '#94a3b8',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4
  }
})
