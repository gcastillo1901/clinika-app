import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PacientesScreen from '../screens/PacientesScreen';
import CrearPacienteScreen from '../screens/CrearPacienteScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Pacientes" component={PacientesScreen} />
        <Stack.Screen name="NuevoPaciente" component={CrearPacienteScreen} options={{ title: 'Nuevo Paciente' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
