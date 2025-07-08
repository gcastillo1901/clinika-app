import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PacientesScreen from '../screens/PacientesScreen';
import CrearPacienteScreen from '../screens/CrearPacienteScreen';
import DetallePacienteScreen from "../screens/DetallePacienteScreen";
import HistorialScreen from '../screens/HistorialScreen';
import NuevoHistorialScreen from '../screens/NuevoHistorialScreen';


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Pacientes" component={PacientesScreen} />
        <Stack.Screen name="NuevoPaciente" component={CrearPacienteScreen} options={{ title: 'Nuevo Paciente' }} />
        <Stack.Screen name="DetallePaciente" component={DetallePacienteScreen} options={{ title: "Detalle del Paciente" }} />
        <Stack.Screen name="Historial" component={HistorialScreen} />
        <Stack.Screen name="NuevoHistorial" component={NuevoHistorialScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
