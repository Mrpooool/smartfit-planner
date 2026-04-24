import { StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { colors, radius } from "../theme";

export function CalendarView(props) {
  const markedDates = makeMarkedDates(props.completedDates || []);

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        theme={{
          calendarBackground: colors.card,
          monthTextColor: colors.textPrimary,
          textSectionTitleColor: colors.textSecondary,
          dayTextColor: colors.textPrimary,
          textDisabledColor: colors.textTertiary,
          todayTextColor: colors.primary,
          arrowColor: colors.primary,
        }}
      />
    </View>
  );
}

function makeMarkedDates(completedDates = []) {
  const result = {};

  completedDates.forEach(function addMarkedDateCB(date) {
    result[date] = {
      selected: true,
      selectedColor: colors.successCalendar,
      selectedTextColor: colors.card,
    };
  });

  return result;
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginBottom: 20,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    overflow: "hidden",
  },
});
