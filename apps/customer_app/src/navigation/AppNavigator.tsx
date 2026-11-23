import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { LoginScreen } from "../screens/LoginScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { TrackingScreen } from "../screens/TrackingScreen";
import { ServiceProgressScreen } from "../screens/ServiceProgressScreen";
import { PaymentScreen } from "../screens/PaymentScreen";
import { AccountScreen } from "../screens/AccountScreen";
import { NotificationsScreen } from "../screens/NotificationsScreen";

export type MainTabParamList = {
  HomeTab: undefined;
  AccountTab: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  Notifications: undefined;
  Tracking: { requestId: string; technicianId: string; technicianName: string; distanceKm: number };
  ServiceProgress: { requestId: string; technicianId: string };
  Payment: { requestId: string; technicianId: string; laborCost: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICON: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
  HomeTab: "home",
  AccountTab: "person",
};

const TAB_LABEL: Record<keyof MainTabParamList, string> = {
  HomeTab: "Inicio",
  AccountTab: "Cuenta",
};

// Un unico Tab.Navigator para Inicio/Cuenta evita que la barra inferior se
// redibuje o duplique al cambiar de pantalla (cada pestaña mantiene su
// propio estado y React Navigation resalta sola la pestaña activa).
function MainTabs(): React.JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: { name: keyof MainTabParamList } }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { borderTopColor: colors.border },
        tabBarIcon: ({ color, size }: { color: string; size: number }) => (
          <Ionicons name={TAB_ICON[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: TAB_LABEL.HomeTab }} />
      <Tab.Screen name="AccountTab" component={AccountScreen} options={{ title: TAB_LABEL.AccountTab }} />
    </Tab.Navigator>
  );
}

export function AppNavigator({ initialRouteName }: { initialRouteName?: "Login" | "MainTabs" }): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRouteName ?? "Login"}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: true, title: "Notificaciones" }} />
        <Stack.Screen name="Tracking" component={TrackingScreen} />
        <Stack.Screen name="ServiceProgress" component={ServiceProgressScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
