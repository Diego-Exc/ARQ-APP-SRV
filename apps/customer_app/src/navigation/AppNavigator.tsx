import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../screens/HomeScreen";
import { DiagnosisScreen } from "../screens/DiagnosisScreen";
import { TechnicianListScreen } from "../screens/TechnicianListScreen";
import { TrackingScreen } from "../screens/TrackingScreen";
import { ServiceProgressScreen } from "../screens/ServiceProgressScreen";
import { PaymentScreen } from "../screens/PaymentScreen";

export type RootStackParamList = {
  Home: undefined;
  Diagnosis: undefined;
  Technicians: undefined;
  Tracking: undefined;
  ServiceProgress: undefined;
  Payment: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Diagnosis" component={DiagnosisScreen} />
        <Stack.Screen name="Technicians" component={TechnicianListScreen} />
        <Stack.Screen name="Tracking" component={TrackingScreen} />
        <Stack.Screen name="ServiceProgress" component={ServiceProgressScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
