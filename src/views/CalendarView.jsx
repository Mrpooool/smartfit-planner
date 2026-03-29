import { StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";

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
      selectedColor: "#22c55e",
    };
  });

  return result;
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
});