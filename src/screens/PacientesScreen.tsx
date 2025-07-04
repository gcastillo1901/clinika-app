import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { supabase } from '../lib/supabase';

export default function PacientesScreen({ navigation }: any) {
  const [pacientes, setPacientes] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('pacientes').select('*');
      if (error) {
        console.error(error);
      } else {
        setPacientes(data);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Pacientes</Text>

      <Button title="➕ Nuevo Paciente" onPress={() => navigation.navigate('NuevoPaciente')} />

      <FlatList
        data={pacientes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.item}>{item.nombre} {item.apellido}</Text>
        )}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 50 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  item: { fontSize: 16, paddingVertical: 4 },
});
