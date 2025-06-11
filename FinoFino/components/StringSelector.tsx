import React from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native"

interface StringSelectorProps {
  strings: { name: string; frequency: number; string: string }[]
  currentString: string
  onSelectString: (note: string) => void
}

export default function StringSelector({
  strings,
  currentString,
  onSelectString,
}: StringSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Selecciona una cuerda:</Text>
      <View style={styles.grid}>
        {strings.map((string, index) => {
          const isSelected = currentString === string.name
          return (
            <TouchableOpacity
              key={index}
              onPress={() => onSelectString(string.name)}
              style={[
                styles.button,
                isSelected ? styles.selectedButton : styles.unselectedButton,
              ]}
            >
              <Text style={styles.buttonTitle}>{string.name}</Text>
              <Text style={styles.buttonSubtitle}>{string.string}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#94A3B8", // slate-400
    marginBottom: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4, // requiere React Native >= 0.71, si no tenes, se reemplaza
    justifyContent: "space-between",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "16%", // para que entren 6 en una fila
    minWidth: 50,
  },
  selectedButton: {
    backgroundColor: "#059669", // emerald-600
  },
  unselectedButton: {
    backgroundColor: "#334155", // slate-700
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  buttonSubtitle: {
    fontSize: 10,
    marginTop: 2,
    color: "#E2E8F0", // slate-300
  },
})
