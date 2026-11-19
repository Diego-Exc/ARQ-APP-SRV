import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "../screens/LoginScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { IncomingRequestsScreen } from "../screens/IncomingRequestsScreen";
import { ServiceDetailScreen } from "../screens/ServiceDetailScreen";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  IncomingRequests: undefined;
  ServiceDetail: { requestId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="IncomingRequests" component={IncomingRequestsScreen} />
        <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
