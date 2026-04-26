import { StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { colors, radius } from "../theme";

export function CalendarView(props) {
  const markedDates = makeMarkedDates(props.completedDates || [], props.selectedDate);
  const compact = Boolean(props.compact);

  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      <Calendar
        markedDates={markedDates}
        onDayPress={props.onDatePress}
        theme={{
          calendarBackground: colors.card,
          monthTextColor: colors.textPrimary,
          textSectionTitleColor: colors.textSecondary,
          dayTextColor: colors.textPrimary,
          textDisabledColor: colors.textTertiary,
          todayTextColor: colors.primary,
          arrowColor: colors.primary,
          textDayFontSize: compact ? 14 : 16,
          textMonthFontSize: compact ? 16 : 18,
          textDayHeaderFontSize: compact ? 13 : 14,
        }}
      />
    </View>
  );
}

function makeMarkedDates(completedDates = [], selectedDate) {
  const result = {};

  completedDates.forEach(function addMarkedDateCB(date) {
    result[date] = {
      selected: true,
      selectedColor: colors.successCalendar,
      selectedTextColor: colors.card,
    };
  });

  if (selectedDate && !result[selectedDate]) {
    result[selectedDate] = {
      selected: true,
      selectedColor: colors.primaryLight,
      selectedTextColor: colors.primaryDark,
    };
  }

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
  containerCompact: {
    marginTop: 8,
    marginBottom: 10,
  },
});
