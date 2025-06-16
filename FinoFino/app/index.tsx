import React from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Image,
} from "react-native"
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react-native"

import TunerDisplay from "../components/TunerDisplay"
import StringSelector from "../components/StringSelector"
import { useGuitarTuner } from "../hooks/useGuitarTuner"

export default function GuitarTunerScreen() {
  const colorScheme = useColorScheme()

  const {
    guitarStrings,
    targetString,
    targetNote,
    tuningAccuracy,
    detectedFrequency,
    detectedTone,
    isListening,
    isMuted,
    toggleListening,
    toggleMute,
    handleStringSelect,
  } = useGuitarTuner()

  const styles = colorScheme === "dark" ? darkStyles : lightStyles

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/images/icon.png")}
          style={styles.iconImage}
          resizeMode="contain"
        />
        <Text style={styles.title}>Afinador de Guitarra</Text>
      </View>

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
            style={[
              styles.listenButton,
              isListening ? styles.stopButton : styles.startButton,
            ]}
          >
            {isListening ? (
              <MicOff color="white" size={20} />
            ) : (
              <Mic color="white" size={20} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleMute}
            style={styles.muteButton}
            disabled={!isListening}
          >
            {isMuted ? (
              <VolumeX color="white" size={20} />
            ) : (
              <Volume2 color="white" size={20} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          Toca una cuerda y ajustala hasta que la aguja este centrada
        </Text>
        <Text style={styles.instructionText}>
          Selecciona la cuerda que deseas afinar
        </Text>
      </View>
    </ScrollView>
  )
}

// Estilos para modo oscuro
const darkStyles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#0f172a",
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 40,
  },
  iconImage: {
    width: 28,
    height: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  card: {
    width: "100%",
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 24,
  },
  listenButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "#10b981",
  },
  stopButton: {
    backgroundColor: "#ef4444",
  },
  muteButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
  },
  instructions: {
    marginTop: 24,
    alignItems: "center",
  },
  instructionText: {
    color: "#94a3b8",
    fontSize: 13,
    textAlign: "center",
    marginTop: 4,
  },
})

// Estilos para modo claro
const lightStyles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#ffffff",
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 40,
  },
  iconImage: {
    width: 28,
    height: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f2937",
  },
  card: {
    width: "100%",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 24,
  },
  listenButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "#10b981",
  },
  stopButton: {
    backgroundColor: "#ef4444",
  },
  muteButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#9ca3af",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
  },
  instructions: {
    marginTop: 24,
    alignItems: "center",
  },
  instructionText: {
    color: "#475569",
    fontSize: 13,
    textAlign: "center",
    marginTop: 4,
  },
})
