// src/screens/AgendarCitaScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { supabase } from "../lib/supabase";
import Toast from "react-native-toast-message";

export default function AgendarCitaScreen({ route, navigation }: any) {
  const { paciente } = route.params;
  const [fecha, setFecha] = useState(new Date());
  const [hora, setHora] = useState("08:00");
  const [motivo, setMotivo] = useState("");
  const [notas, setNotas] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleGuardar = async () => {
    const { error } = await supabase.from("citas").insert([
      {
        paciente_id: paciente.id,
        fecha: fecha.toISOString().split("T")[0],
        hora,
        motivo,
        notas_adicionales: notas,
      },
    ]);

    if (error) {
      Alert.alert("Error", "No se pudo guardar la cita.");
    } else {
      Toast.show({ type: "success", text1: "Cita agendada" });
      navigation.goBack();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>📅 Agendar Cita</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Fecha</Text>
        <Text style={styles.input} onPress={() => setShowDatePicker(true)}>
          {fecha.toISOString().split("T")[0]}
        </Text>
        {showDatePicker && (
          <DateTimePicker
            value={fecha}
            mode="date"
            display="default"
            onChange={(e, date) => {
              setShowDatePicker(false);
              if (date) setFecha(date);
            }}
          />
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Hora</Text>
        <TextInput
          style={styles.input}
          placeholder="08:00"
          value={hora}
          onChangeText={setHora}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Motivo</Text>
        <TextInput
          style={styles.input}
          placeholder="Motivo de la cita"
          value={motivo}
          onChangeText={setMotivo}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Notas Adicionales</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          multiline
          value={notas}
          onChangeText={setNotas}
        />
      </View>

      <Button title="Guardar Cita" onPress={handleGuardar} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    paddingBottom: 80,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontWeight: "500",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    backgroundColor: "#f9f9f9",
  },
});
