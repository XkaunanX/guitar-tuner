import React, { useEffect, useState, useRef } from "react"
import { View, Text, Animated, StyleSheet } from "react-native"

const needleHeight = 96

interface TunerDisplayProps {
  currentNote: string
  targetNote: string
  tuningAccuracy: number
  frequency: number
  isListening: boolean
}

export default function TunerDisplay({
  currentNote,
  targetNote,
  tuningAccuracy,
  frequency,
  isListening,
}: TunerDisplayProps) {
  const clampedAccuracy = Math.max(-50, Math.min(50, tuningAccuracy))
  const rotationValue = useRef(new Animated.Value(clampedAccuracy)).current

  const [statusText, setStatusText] = useState("Esperando...")
  const [statusColor, setStatusColor] = useState("#94A3B8") // slate-400

  useEffect(() => {
    Animated.spring(rotationValue, {
      toValue: clampedAccuracy,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start()
  }, [clampedAccuracy])

  const rotate = rotationValue.interpolate({
    inputRange: [-50, 0, 50],
    outputRange: ["-45deg", "0deg", "45deg"],
    extrapolate: "clamp",
  })

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

  return (
    <View style={styles.container}>
      <View style={styles.rowBetween}>
        <Text style={styles.hintText}>♭ Bajo</Text>
        <Text style={styles.hintText}>Alto ♯</Text>
      </View>

      <View style={styles.meterContainer}>
        <View style={styles.meterTrack}>
          <View style={styles.centerLine} />
        </View>

        <Animated.View
          style={[
            styles.needle,
            {
              transform: [
                { translateY: needleHeight / 2 - 8 },
                { rotate },
                { translateY: -needleHeight / 2 + 8 },
              ],
            },
          ]}
        />


        <View style={styles.centerPoint} />
      </View>

      <View style={styles.noteDisplay}>
        <View style={styles.noteRow}>
          <Text style={styles.currentNote}>{currentNote || "-"}</Text>
          {targetNote ? (
            <Text style={styles.targetNote}>→ {targetNote}</Text>
          ) : null}
        </View>

        <Text style={[styles.statusText, { color: statusColor }]}>
          {statusText}
        </Text>

        {frequency > 0 && (
          <Text style={styles.frequencyText}>
            {frequency.toFixed(1)} Hz
          </Text>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
  },
  hintText: {
    fontSize: 14,
    color: "#94A3B8",
  },
  meterContainer: {
    height: 130,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  meterTrack: {
    position: "absolute",
    width: "100%",
    height: 8,
    backgroundColor: "#334155",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  centerLine: {
    position: "absolute",
    height: 16,
    width: 2,
    backgroundColor: "#CBD5E1",
  },
  needle: {
    position: "absolute",
    bottom: 0,
    height: needleHeight,
    width: 2,
    backgroundColor: "#EF4444",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  centerPoint: {
    position: "absolute",
    bottom: 0,
    height: 16,
    width: 16,
    backgroundColor: "#0F172A",
    borderWidth: 2,
    borderColor: "#EF4444",
    borderRadius: 999,
  },
  noteDisplay: {
    marginTop: 24,
    alignItems: "center",
  },
  noteRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  currentNote: {
    fontSize: 48,
    fontWeight: "bold",
    marginRight: 8,
  },
  targetNote: {
    fontSize: 24,
    color: "#94A3B8",
  },
  statusText: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: "500",
  },
  frequencyText: {
    marginTop: 4,
    fontSize: 14,
    color: "#94A3B8",
  },
})
