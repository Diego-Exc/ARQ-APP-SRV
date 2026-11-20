import React, { useState } from "react";
import { ScrollView, View, Text, Switch, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { weekSchedule } from "../data/mock";

export function ScheduleScreen(): React.JSX.Element {
  const [schedule, setSchedule] = useState(weekSchedule);

  function toggleDay(index: number) {
    setSchedule((prev) => prev.map((day, i) => (i === index ? { ...day, enabled: !day.enabled } : day)));
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Mi horario</Text>
      <Text style={styles.subheader}>Define los días y horas en los que recibirás solicitudes.</Text>

      {schedule.map((day, index) => (
        <View key={day.day} style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons
              name="calendar"
              size={18}
              color={day.enabled ? colors.accent : colors.textSecondary}
            />
            <View>
              <Text style={styles.dayLabel}>{day.day}</Text>
              <Text style={styles.hoursLabel}>{day.enabled ? `${day.from} – ${day.to}` : "No disponible"}</Text>
            </View>
          </View>
          <Switch value={day.enabled} onValueChange={() => toggleDay(index)} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 32 },
  header: { fontSize: 20, fontWeight: "700", color: colors.primary },
  subheader: { color: colors.textSecondary, marginTop: 4, marginBottom: 16, fontSize: 12 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  dayLabel: { color: colors.textPrimary, fontWeight: "700", fontSize: 13 },
  hoursLabel: { color: colors.textSecondary, fontSize: 11, marginTop: 2 },
});
