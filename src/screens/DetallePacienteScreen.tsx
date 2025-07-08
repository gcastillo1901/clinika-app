import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { supabase } from "../lib/supabase";
import Toast from "react-native-toast-message";

export default function DetallePacienteScreen({ route, navigation }: any) {
  const { paciente } = route.params;

  const calcularEdad = (fechaNacimiento: string) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const registrarVisita = async () => {
    const hoy = new Date().toISOString().split("T")[0];

    const { error } = await supabase
      .from("pacientes")
      .update({ ultima_visita: hoy })
      .eq("id", paciente.id);

    if (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo registrar la visita",
      });
    } else {
      Toast.show({
        type: "success",
        text1: "Visita registrada",
        text2: `Última visita: ${hoy}`,
      });
      navigation.goBack(); // Regresar para que se actualice la lista
    }
  };

  const confirmarEliminacion = () => {
    Alert.alert(
      "Eliminar paciente",
      `¿Estás seguro que deseas eliminar a ${paciente.nombre} ${paciente.apellido}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            eliminarPaciente();
          },
        },
      ]
    );
  };

  const eliminarPaciente = async () => {
    const { error } = await supabase
      .from("pacientes")
      .delete()
      .eq("id", paciente.id);

    if (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo eliminar el paciente",
      });
    } else {
      Toast.show({
        type: "success",
        text1: "Paciente eliminado",
      });
      navigation.goBack(); // Regresar a la lista
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.nombre}>
        {paciente.nombre} {paciente.apellido}
      </Text>

      <View style={styles.infoRow}>
        <Icon name="calendar-outline" size={16} color="#555" />
        <Text style={styles.infoText}>
          Edad: {calcularEdad(paciente.fecha_nacimiento)} años
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Icon name="person-outline" size={16} color="#555" />
        <Text style={styles.infoText}>
          Sexo: {paciente.sexo === "M" ? "Masculino" : "Femenino"}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Icon name="card-outline" size={16} color="#555" />
        <Text style={styles.infoText}>Cédula: {paciente.cedula ?? "N/A"}</Text>
      </View>

      <View style={styles.infoRow}>
        <Icon name="call-outline" size={16} color="#555" />
        <Text style={styles.infoText}>Teléfono: {paciente.telefono}</Text>
      </View>

      <View style={styles.infoRow}>
        <Icon name="mail-outline" size={16} color="#555" />
        <Text style={styles.infoText}>Correo: {paciente.correo ?? "N/A"}</Text>
      </View>

      <View style={styles.infoRow}>
        <Icon name="home-outline" size={16} color="#555" />
        <Text style={styles.infoText}>
          Dirección: {paciente.direccion ?? "N/A"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚨 Contacto de Emergencia</Text>
        <Text style={styles.infoText}>
          {paciente.nombre_contacto_emergencia ?? "Sin nombre"} ·{" "}
          {paciente.telefono_contacto_emergencia ?? "Sin teléfono"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📝 Observaciones</Text>
        <Text style={styles.infoText}>
          {paciente.observacion ?? "Sin observaciones"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 Última visita</Text>
        <Text style={styles.infoText}>
          {paciente.ultima_visita ?? "Sin registro"}
        </Text>
      </View>

      {/* Botones */}
      <View style={styles.botones}>
        <Button title="Registrar Visita" onPress={() => registrarVisita()} />
        <View style={{ marginVertical: 10 }} />
        <Button
          title="Editar"
          onPress={() =>
            navigation.navigate("NuevoPaciente", { paciente, modo: "editar" })
          }
        />
        <View style={{ marginVertical: 10 }} />
        <Button
          title="Ver Historial Clínico"
          onPress={() => navigation.navigate("Historial", { paciente })}
        />
        <View style={{ marginVertical: 10 }} />
        <Button
          title="Eliminar"
          onPress={() => confirmarEliminacion()}
          color="red"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    paddingBottom: 60,
  },
  nombre: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 4,
    fontSize: 16,
  },
  botones: {
    marginTop: 30,
  },
});
