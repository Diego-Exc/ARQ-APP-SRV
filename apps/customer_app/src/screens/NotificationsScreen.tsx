import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { clientNotifications } from "../data/mock";

export function NotificationsScreen(): React.JSX.Element {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {clientNotifications.map((item) => (
        <View key={item.id} style={[styles.row, !item.read && styles.rowUnread]}>
          <View style={styles.icon}>
            <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={18} color={colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
          {!item.read ? <View style={styles.dot} /> : null}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 32 },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  rowUnread: { borderColor: colors.accent },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { color: colors.textPrimary, fontWeight: "700", fontSize: 13 },
  description: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  time: { color: colors.textSecondary, fontSize: 10, marginTop: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent, marginTop: 4 },
});
