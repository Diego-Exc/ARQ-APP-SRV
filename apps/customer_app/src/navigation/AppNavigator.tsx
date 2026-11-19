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
  Diagnosis: {
    requestId: string;
    tradeId: string | null;
    tradeName: string | null;
    confidence: number;
    urgency: string;
    urgencyReason: string;
    description: string;
  };
  Technicians: {
    requestId: string;
    candidates: { technicianId: string; name: string; distanceKm: number; rating: number; score: number }[];
  };
  Tracking: { requestId: string; technicianId: string; technicianName: string };
  ServiceProgress: { requestId: string; technicianId: string };
  Payment: { requestId: string; technicianId: string; laborCost: number };
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
