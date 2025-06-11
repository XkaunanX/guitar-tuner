import { View, Text, StyleSheet, Button } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Afinador de guitarra</Text>
      <Button title="Iniciar afinacion" onPress={() => alert('Escuchando...')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111' },
  title: { color: '#fff', fontSize: 24, marginBottom: 16, fontFamily: 'SpaceMono' },
});
