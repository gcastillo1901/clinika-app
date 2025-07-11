import React, { useCallback, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { supabase } from "../lib/supabase";
import Toast from "react-native-toast-message";
import { useFocusEffect } from "@react-navigation/native";

interface EditarPacienteButtonProps {
  readonly onPress: () => void;
}

const EditarPacienteButton: React.FC<EditarPacienteButtonProps> = ({
  onPress,
}) => (
  <TouchableOpacity onPress={onPress} style={styles.botonEditar}>
    <Icon name="pencil" size={18} color="#fff" />
    <Text style={styles.textoBoton}>Editar</Text>
  </TouchableOpacity>
);

// --- COMPONENTE HEADER DERECHO FUERA DEL COMPONENTE PRINCIPAL ---
const HeaderRightEditarPaciente: React.FC<{ onPress: () => void }> = React.memo(({ onPress }) => (
  <EditarPacienteButton onPress={onPress} />
));

// --- FUNCIÓN PARA HEADER DERECHO (fuera del componente principal) ---
function renderHeaderRightEditarPaciente(onPress: () => void) {
  return () => <HeaderRightEditarPaciente onPress={onPress} />;
}

export default function DetallePacienteScreen({ route, navigation }: any) {
  const { paciente } = route.params;
  const [pacienteActualizado, setPacienteActualizado] = useState(paciente);
  const [historial, setHistorial] = useState<any[]>([]);
  const [citas, setCitas] = useState<any[]>([]);
  const [tabSeleccionado, setTabSeleccionado] = useState<"historial" | "citas">(
    "historial"
  );

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

  const cargarDatos = async () => {
    const { data, error } = await supabase
      .from("pacientes")
      .select("*")
      .eq("id", paciente.id)
      .single();
    if (!error && data) setPacienteActualizado(data);

    const { data: hData } = await supabase
      .from("historial")
      .select("*")
      .eq("paciente_id", paciente.id)
      .order("fecha", { ascending: false });
    if (hData) setHistorial(hData);

    const { data: cData } = await supabase
      .from("citas")
      .select("*")
      .eq("paciente_id", paciente.id)
      .order("fecha", { ascending: false });
    if (cData) setCitas(cData);
  };

  const handleEditarPaciente = useCallback(
    () => navigation.navigate("NuevoPaciente", {
              paciente: pacienteActualizado,
              modo: "editar",
            }),
    [navigation]
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: renderHeaderRightEditarPaciente(handleEditarPaciente),
    });
  }, [navigation, handleEditarPaciente]);

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [paciente.id])
  );

  const confirmarEliminacion = () => {
    Alert.alert(
      "Eliminar paciente",
      `¿Eliminar a ${pacienteActualizado.nombre} ${pacienteActualizado.apellido}?`,
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
        text2: "No se pudo eliminar",
      });
    } else {
      Toast.show({ type: "success", text1: "Paciente eliminado" });
      navigation.goBack();
    }
  };

  let contenidoTab: React.ReactNode;
  if (tabSeleccionado === "historial") {
    if (historial.length > 0) {
      contenidoTab = historial.map((item, index) => (
        <View key={item.id} style={styles.itemCard}>
          <Text style={styles.itemTitulo}>🩺 {item.diagnostico}</Text>
          <Text style={styles.itemFecha}>
            📅 {new Date(item.fecha).toLocaleDateString()}
          </Text>
          <Text style={styles.itemNota}>Motivo: {item.motivo_consulta}</Text>
          <Text style={styles.itemNota}>Tratamiento: {item.tratamiento}</Text>
          {item.notas && (
            <Text style={styles.itemNota}>Notas: {item.notas}</Text>
          )}
        </View>
      ));
    } else {
      contenidoTab = (
        <Text style={styles.infoText}>No hay historial clínico.</Text>
      );
    }
  } else if (citas.length > 0) {
    contenidoTab = citas.map((item, index) => (
      <View key={item.id} style={styles.itemCard}>
        <Text style={styles.itemTitulo}>🗓 {item.motivo}</Text>
        <Text style={styles.itemFecha}>
          Fecha: {new Date(item.fecha).toLocaleDateString()} {item.hora}
        </Text>
        {item.notas_adicionales && (
          <Text style={styles.itemNota}>Notas: {item.notas_adicionales}</Text>
        )}
      </View>
    ));
  } else {
    contenidoTab = (
      <Text style={styles.infoText}>No hay citas registradas.</Text>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cabecera con datos principales */}
      <View style={styles.header}>
        <Icon name="person-circle-outline" size={64} color="#007aff" />
        <View style={{ marginLeft: 16 }}>
          <Text style={styles.nombre}>
            {pacienteActualizado.nombre} {pacienteActualizado.apellido}
          </Text>
          <Text style={styles.secundario}>
            Cédula: {pacienteActualizado.cedula ?? "N/A"}
          </Text>
          <Text style={styles.secundario}>
            {calcularEdad(pacienteActualizado.fecha_nacimiento)} años ·{" "}
            {pacienteActualizado.sexo === "M" ? "Masculino" : "Femenino"}
          </Text>
        </View>
      </View>

      <View style={styles.infoBlock}>
        <View style={styles.col}>
          <Icon name="call-outline" size={16} color="#555" />
          <Text style={styles.infoText}>{pacienteActualizado.telefono}</Text>
        </View>
        <View style={styles.col}>
          <Icon name="mail-outline" size={16} color="#555" />
          <Text style={styles.infoText}>{pacienteActualizado.correo}</Text>
        </View>
        <View style={styles.col}>
          <Icon name="calendar-outline" size={16} color="#555" />
          <Text style={styles.infoText}>
            Nacimiento:{" "}
            {new Date(
              pacienteActualizado.fecha_nacimiento
            ).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.col}>
          <Icon name="home-outline" size={16} color="#555" />
          <Text style={styles.infoText}>{pacienteActualizado.direccion}</Text>
        </View>
        <View style={styles.col}>
          <Icon name="alert-outline" size={16} color="#555" />
          <Text style={styles.infoText}>
            Emergencia: {pacienteActualizado.nombre_contacto_emergencia} ·{" "}
            {pacienteActualizado.telefono_contacto_emergencia}
          </Text>
        </View>
      </View>

      {/* Botones de acción */}
      <View style={styles.botonesFila}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#28a745" }]}
          onPress={() =>
            navigation.navigate("AgendarCita", {
              paciente: pacienteActualizado,
            })
          }
        >
        <Icon name="calendar" size={18} color="#fff" style={{ marginRight: 6 }} />
        <Text style={styles.btnTexto}>Agendar Cita</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#007aff" }]}
          onPress={() =>
            navigation.navigate("NuevoHistorial", {
              paciente: pacienteActualizado,
            })
          }
        >
         <Icon name="clipboard" size={18} color="#fff" style={{ marginRight: 6 }} />
         <Text style={styles.btnTexto}>Registrar Visita</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            tabSeleccionado === "historial" && styles.tabActivo,
          ]}
          onPress={() => setTabSeleccionado("historial")}
        >
          <Text style={styles.tabTexto}>Historial Clínico</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            tabSeleccionado === "citas" && styles.tabActivo,
          ]}
          onPress={() => setTabSeleccionado("citas")}
        >
          <Text style={styles.tabTexto}>Historial de Citas</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido del tab */}
      <View style={{ marginTop: 10 }}>{contenidoTab}</View>

      {/* Edición y eliminar */}
      
        <View style={{ height: 10}} >
        <TouchableOpacity
  style={[styles.btn, { backgroundColor: "#dc3545", flexDirection: 'row', justifyContent: 'center' }]}
  onPress={confirmarEliminacion}
>
  <Icon name="trash-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
  <Text style={styles.btnTexto}>Eliminar</Text>
</TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  nombre: {
    fontSize: 20,
    fontWeight: "bold",
  },
  secundario: {
    fontSize: 14,
    color: "#666",
  },
  infoBlock: {
    marginBottom: 20,
  },
  col: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  botonesFila: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 20,
  },
  btn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
  },
  tabActivo: {
    backgroundColor: "#007aff",
  },
  tabTexto: {
    color: "#000",
    fontWeight: "bold",
  },
  itemCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
  },
  itemTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  itemFecha: {
    fontSize: 14,
    color: "#555",
  },
  itemNota: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  botonEditar: {
    flexDirection: "row",
    backgroundColor: "#000",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  textoBoton: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "600",
  },
});
