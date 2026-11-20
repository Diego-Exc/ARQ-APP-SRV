import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "../screens/LoginScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { TrackingScreen } from "../screens/TrackingScreen";
import { ServiceProgressScreen } from "../screens/ServiceProgressScreen";
import { PaymentScreen } from "../screens/PaymentScreen";
import { AccountScreen } from "../screens/AccountScreen";
import { NotificationsScreen } from "../screens/NotificationsScreen";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Account: undefined;
  Notifications: undefined;
  Tracking: { requestId: string; technicianId: string; technicianName: string; distanceKm: number };
  ServiceProgress: { requestId: string; technicianId: string };
  Payment: { requestId: string; technicianId: string; laborCost: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator({ initialRouteName }: { initialRouteName?: "Login" | "Home" }): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRouteName ?? "Login"}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Account" component={AccountScreen} options={{ headerShown: true, title: "Mi cuenta" }} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: true, title: "Notificaciones" }} />
        <Stack.Screen name="Tracking" component={TrackingScreen} />
        <Stack.Screen name="ServiceProgress" component={ServiceProgressScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
