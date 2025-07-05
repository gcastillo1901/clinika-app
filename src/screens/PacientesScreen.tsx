import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { supabase } from "../lib/supabase";
import Icon from "react-native-vector-icons/Ionicons";
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';

export default function PacientesScreen({ navigation }: any) {
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("NuevoPaciente")}
          style={styles.botonNuevo}
        >
          <Icon name="add" size={18} color="#fff" />
          <Text style={styles.textoBoton}>Nuevo</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const fetchPacientes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pacientes")
      .select("*")
      .order("nombre", { ascending: true });

    if (error) console.error(error);
    else setPacientes(data);

    setLoading(false);
  };

  useFocusEffect(
  React.useCallback(() => {
    fetchPacientes();

    const wasCreated = navigation.getState().routes.find(
  (r: { name: string; params?: { creado?: boolean } }) => r.name === 'Pacientes'
)?.params?.creado;

    if (wasCreated) {
      Toast.show({
        type: 'success',
        text1: 'Paciente agregado',
        text2: 'El paciente se ha agregado correctamente.',
      });

      navigation.setParams({ creado: undefined });
    }
  }, [navigation])
);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPacientes();
    setRefreshing(false);
  };

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

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.nombre}>
        {item.nombre} {item.apellido}
      </Text>
      <View style={styles.infoRow}>
        <Icon name="person-outline" size={16} color="#555" />
        <Text style={styles.infoTexto}>
          {calcularEdad(item.fecha_nacimiento)} años · {item.sexo}
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Icon name="card-outline" size={16} color="#555" />
        <Text style={styles.infoTexto}>{item.cedula ?? "N/A"}</Text>
      </View>
      <View style={styles.infoRow}>
        <Icon name="call-outline" size={16} color="#555" />
        <Text style={styles.infoTexto}>{item.telefono}</Text>
      </View>
      <View style={styles.infoRow}>
        <Icon name="mail-outline" size={16} color="#555" />
        <Text style={styles.infoTexto}>{item.correo}</Text>
      </View>
      <View style={styles.infoRow}>
        <Icon name="calendar-outline" size={16} color="#555" />
        <Text style={styles.infoTexto}>
          Última visita: {item.ultima_visita ?? "Sin registro"}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    );
  }

  return (
    <FlatList
      data={pacientes}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.lista}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        <Text style={styles.vacio}>No hay pacientes registrados.</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  lista: {
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    elevation: 2,
  },
  nombre: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  infoTexto: {
    marginLeft: 6,
    color: "#444",
    fontSize: 14,
  },
  centrado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  vacio: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#888",
  },
  botonNuevo: {
    flexDirection: "row",
    backgroundColor: "#000",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  textoBoton: {
    color: "#fff",
    marginLeft: 4,
    fontWeight: "600",
  },
});
