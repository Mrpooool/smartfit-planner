import { StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { colors, radius } from "../theme";

export function CalendarView(props) {
  const markedDates = makeMarkedDates(props.completedDates || []);

  return (
    <View style={styles.container}>
      <Calendar markedDates={markedDates} />
    </View>
  );
}

function makeMarkedDates(completedDates = []) {
  const result = {};

  completedDates.forEach(function addMarkedDateCB(date) {
    result[date] = {
      selected: true,
      selectedColor: colors.successCalendar,
    };
  });

  return result;
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginBottom: 20,
    borderRadius: radius.md,
    overflow: "hidden",
  },
});