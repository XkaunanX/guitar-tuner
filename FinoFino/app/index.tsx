import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native'
import { Guitar, Mic, MicOff, Volume2, VolumeX } from 'lucide-react-native'

// Importacion de los componentes reutilizables
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

export default function GuitarTunerScreen() {
  const [targetNote, setTargetNote] = useState('E')
  const [isListening, setIsListening] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const selectedString = guitarStrings.find(s => s.name === targetNote)
  const targetFrequency = selectedString ? selectedString.frequency : 0

  const toggleListening = () => {
    Alert.alert('Toggle Listening')
    setIsListening(!isListening)
  }

  const toggleMute = () => {
    Alert.alert('Toggle Mute')
    setIsMuted(!isMuted)
  }

  const handleStringSelect = (note: string) => {
    setTargetNote(note)
    Alert.alert(`Cuerda seleccionada: ${note}`)
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        <Guitar color="white" size={28} /> Afinador de Guitarra
      </Text>

      <View style={styles.card}>
        <TunerDisplay
          currentNote={targetNote}
          targetNote={targetNote}
          tuningAccuracy={0} // cambiar por el valor real cuando lo tengas
          frequency={targetFrequency}
          isListening={isListening}
        />

        <StringSelector
          strings={guitarStrings}
          currentString={targetNote}
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
    alignItems: 'center'
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
