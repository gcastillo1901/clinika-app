import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
  Pressable,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { supabase } from "../lib/supabase";
import Toast from "react-native-toast-message";

export default function CrearPacienteScreen({ navigation }: any) {
  type FormPaciente = {
    nombre: string;
    apellido: string;
    cedula: string;
    fecha_nacimiento: string;
    sexo: string;
    telefono: string;
    correo: string;
    direccion: string;
    nombre_contacto_emergencia: string;
    telefono_contacto_emergencia: string;
    observacion: string;
  };

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    fecha_nacimiento: "",
    sexo: "",
    telefono: "",
    correo: "",
    direccion: "",
    nombre_contacto_emergencia: "",
    telefono_contacto_emergencia: "",
    observacion: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [errores, setErrores] = useState<{ [key: string]: string }>({});

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleDateChange = (event: any, selected?: Date) => {
    setShowDatePicker(false);
    if (selected) {
      const iso = selected.toISOString().split("T")[0];
      setSelectedDate(selected);
      setForm({ ...form, fecha_nacimiento: iso });
    }
  };

  const validarCampos = () => {
    const nuevosErrores: { [key: string]: string } = {};

    if (!form.nombre.trim()) nuevosErrores.nombre = "Este campo es obligatorio";
    if (!form.apellido.trim())
      nuevosErrores.apellido = "Este campo es obligatorio";
    if (!form.fecha_nacimiento)
      nuevosErrores.fecha_nacimiento = "Seleccione una fecha";
    if (!form.sexo) nuevosErrores.sexo = "Seleccione el sexo";
    if (!form.telefono.trim()) nuevosErrores.telefono = "Ingrese el teléfono";
    if (!form.nombre_contacto_emergencia.trim())
      nuevosErrores.contacto_nombre = "Requerido";
    if (!form.telefono_contacto_emergencia.trim())
      nuevosErrores.contacto_telefono = "Requerido";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async () => {
    if (!validarCampos()) {
      Toast.show({
        type: "error",
        text1: "Campos incompletos",
        text2: "Por favor, revisa los campos requeridos",
      });
      return;
    }

    const { error } = await supabase.from("pacientes").insert([form]);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      navigation.navigate("Pacientes", { creado: true });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Información Personal */}
      <Text style={styles.sectionTitle}>🧍 Información Personal</Text>
      <View style={styles.row}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombres *</Text>
          <TextInput
            style={[styles.input, errores.nombre && { borderColor: "red" }]}
            placeholder="Ej: María José"
            value={form.nombre}
            onChangeText={(text) => handleChange("nombre", text)}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Apellidos *</Text>
          <TextInput
            style={[styles.input, errores.apellido && { borderColor: "red" }]}
            placeholder="Ej: González Pérez"
            value={form.apellido}
            onChangeText={(text) => handleChange("apellido", text)}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Número de Cédula</Text>
        <TextInput
          style={styles.input}
          placeholder="001-123456-0000X"
          keyboardType="numeric"
          value={form.cedula}
          onChangeText={(text) => handleChange("cedula", text)}
        />
      </View>

      <View style={styles.row}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fecha de Nacimiento *</Text>
          {Platform.OS === "web" ? (
            <input
              style={{
                ...styles.input,
                ...(errores.fecha_nacimiento ? { borderColor: "red" } : {}),
              }}
              placeholder="dd/mm/aaaa"
              type="date"
              value={form.fecha_nacimiento}
              onChange={(e) => {
                const val = (e.target?.value || "").slice(0, 10);
                handleChange("fecha_nacimiento", val);
              }}
            />
          ) : (
            <>
              <Pressable
                onPress={() => setShowDatePicker(true)}
                style={styles.input}
              >
                <Text
                  style={{ color: form.fecha_nacimiento ? "#000" : "#aaa" }}
                >
                  {form.fecha_nacimiento || "dd/mm/aaaa"}
                </Text>
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Sexo *</Text>
          <View style={[styles.input, errores.sexo && { borderColor: "red" }]}>
            <Picker
              selectedValue={form.sexo}
              onValueChange={(value) => handleChange("sexo", value)}
            >
              <Picker.Item label="Seleccionar" value="" />
              <Picker.Item label="Masculino" value="M" />
              <Picker.Item label="Femenino" value="F" />
            </Picker>
          </View>
        </View>
      </View>

      {/* Información de Contacto */}
      <Text style={styles.sectionTitle}>📞 Información de Contacto</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Teléfono *</Text>
        <TextInput
          style={[styles.input, errores.nombre && { borderColor: "red" }]}
          placeholder="+505 8888-9999"
          keyboardType="phone-pad"
          value={form.telefono}
          onChangeText={(text) => handleChange("telefono", text)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="paciente@email.com"
          keyboardType="email-address"
          value={form.correo}
          onChangeText={(text) => handleChange("correo", text)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Dirección Física</Text>
        <TextInput
          style={[styles.input, { height: 70 }]}
          placeholder="Dirección completa del paciente"
          multiline
          value={form.direccion}
          onChangeText={(text) => handleChange("direccion", text)}
        />
      </View>

      {/* Contacto de Emergencia */}
      <Text style={styles.sectionTitle}>🚨 Contacto de Emergencia</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nombre del Contacto</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre completo"
          value={form.nombre_contacto_emergencia}
          onChangeText={(text) =>
            handleChange("nombre_contacto_emergencia", text)
          }
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Teléfono de Emergencia</Text>
        <TextInput
          style={styles.input}
          placeholder="+505 7777-8888"
          keyboardType="phone-pad"
          value={form.telefono_contacto_emergencia}
          onChangeText={(text) =>
            handleChange("telefono_contacto_emergencia", text)
          }
        />
      </View>

      {/* Observación */}
      <Text style={styles.sectionTitle}>📝 Observaciones</Text>
      <View style={styles.inputGroup}>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Nota adicional del paciente"
          multiline
          value={form.observacion}
          onChangeText={(text) => handleChange("observacion", text)}
        />
      </View>

      <View style={{ marginTop: 30 }}>
        <Button title="Guardar Paciente" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    paddingBottom: 80,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 10,
  },
  row: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    gap: 10,
    justifyContent: "space-between",
  },
  inputGroup: {
    flex: 1,
    marginBottom: 15,
    marginRight: Platform.OS === "web" ? 10 : 0,
  },
  label: {
    marginBottom: 6,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 2,
    marginLeft: 4,
  },
});
