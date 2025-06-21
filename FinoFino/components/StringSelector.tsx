import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"

interface StringSelectorProps {
  strings: { name: string; frequency: number; string: string }[]
  currentString: string
  onSelectString: (stringLabel: string) => void
}

export default function StringSelector({
  strings,
  currentString,
  onSelectString,
}: StringSelectorProps) {
  const firstRow = strings.slice(0, 3)
  const secondRow = strings.slice(3)

  const renderRow = (row: typeof strings) => (
    <View style={styles.row}>
      {row.map((string, index) => {
        const isSelected = currentString === string.string
        return (
          <TouchableOpacity
            key={index}
            onPress={() => onSelectString(string.string)}
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
  )

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Selecciona una cuerda:</Text>
      {renderRow(firstRow)}
      {renderRow(secondRow)}
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
    color: "#94A3B8",
    marginBottom: 8,
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "32%",
    minWidth: 50,
  },
  selectedButton: {
    backgroundColor: "#059669",
  },
  unselectedButton: {
    backgroundColor: "#334155",
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  buttonSubtitle: {
    fontSize: 10,
    marginTop: 2,
    color: "#E2E8F0",
  },
})
