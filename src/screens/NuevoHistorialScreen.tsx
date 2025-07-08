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

export default function NuevoHistorialScreen({ route, navigation }: any) {
  const { paciente } = route.params;
  const [form, setForm] = useState({
    fecha: new Date(),
    motivo_consulta: "",
    diagnostico: "",
    tratamiento: "",
    notas: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleChange = (key: string, value: string | Date) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    const { fecha, ...resto } = form;
    const payload = {
      ...resto,
      fecha: fecha.toISOString().split("T")[0],
      paciente_id: paciente.id,
    };

    const { error } = await supabase.from("historial").insert([payload]);

    if (error) {
      Alert.alert("Error", "No se pudo guardar el registro.");
    } else {
      Toast.show({
        type: "success",
        text1: "Registro guardado",
      });
      navigation.goBack();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>📝 Nuevo Registro Clínico</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Fecha</Text>
        <Text
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          {form.fecha.toISOString().split("T")[0]}
        </Text>
        {showDatePicker && (
          <DateTimePicker
            value={form.fecha}
            mode="date"
            display="default"
            onChange={(e, date) => {
              setShowDatePicker(false);
              if (date) handleChange("fecha", date);
            }}
          />
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Motivo de consulta</Text>
        <TextInput
          style={styles.input}
          value={form.motivo_consulta}
          onChangeText={(text) => handleChange("motivo_consulta", text)}
          placeholder="Dolor abdominal, chequeo, etc."
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Diagnóstico</Text>
        <TextInput
          style={styles.input}
          value={form.diagnostico}
          onChangeText={(text) => handleChange("diagnostico", text)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tratamiento</Text>
        <TextInput
          style={styles.input}
          value={form.tratamiento}
          onChangeText={(text) => handleChange("tratamiento", text)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Notas adicionales</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          multiline
          value={form.notas}
          onChangeText={(text) => handleChange("notas", text)}
        />
      </View>

      <Button title="Guardar Registro" onPress={handleSubmit} />
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
