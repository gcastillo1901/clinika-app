import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../lib/supabase";


export default function HistorialScreen({ route, navigation }: any) {
  const { paciente } = route.params;
  const [historial, setHistorial] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistorial = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("historial")
      .select("*")
      .eq("paciente_id", paciente.id)
      .order("fecha", { ascending: false });

    if (!error) setHistorial(data);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchHistorial);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.fecha}>🗓 {item.fecha}</Text>
      <Text style={styles.titulo}>Motivo: {item.motivo_consulta}</Text>
      <Text>🩺 Diagnóstico: {item.diagnostico}</Text>
      <Text>💊 Tratamiento: {item.tratamiento}</Text>
      {item.notas ? <Text>📝 Notas: {item.notas}</Text> : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.tituloPrincipal}>
        Historial de {paciente.nombre} {paciente.apellido}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007aff" />
      ) : (
        <FlatList
          data={historial}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={{ marginTop: 30, textAlign: "center", color: "#777" }}>
              No hay historial registrado.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  tituloPrincipal: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  fecha: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  titulo: {
    fontWeight: "600",
    marginBottom: 4,
  },
  boton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    justifyContent: "center",
  },
  botonTexto: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
  },
});
