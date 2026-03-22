// Uses react-native-calendars (install: npx expo install react-native-calendars)
// import { Calendar } from "react-native-calendars";

import { View, Text, StyleSheet } from "react-native";

export function CalendarView({ completedDates }) {
  // completedDates: string[] of "YYYY-MM-DD" strings
  // TODO: transform completedDates into markedDates format for react-native-calendars
  // const markedDates = completedDates.reduce((acc, date) => {
  //   acc[date] = { marked: true, dotColor: "#6366f1" };
  //   return acc;
  // }, {});
  // return <Calendar markedDates={markedDates} />;

  return (
    <View style={styles.placeholder}>
      <Text style={styles.text}>📅 Calendar (react-native-calendars)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: { height: 120, backgroundColor: "#f3f4f6", borderRadius: 10, alignItems: "center", justifyContent: "center", marginVertical: 12 },
  text: { color: "#9ca3af" },
});
