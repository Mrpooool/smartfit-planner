import { StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { colors, radius } from "../theme";

export function CalendarView(props) {
  const markedDates = makeMarkedDates(props.completedDates || [], props.selectedDate);
  const compact = Boolean(props.compact);

  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      <Calendar
        markingType="custom"
        markedDates={markedDates}
        onDayPress={props.onDatePress}
        theme={{
          calendarBackground: colors.card,
          monthTextColor: colors.textPrimary,
          textSectionTitleColor: colors.textSecondary,
          dayTextColor: colors.textPrimary,
          textDisabledColor: colors.textTertiary,
          todayTextColor: colors.primaryDark,
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
  const today = getLocalDateString();

  completedDates.forEach(function addMarkedDateCB(date) {
    result[date] = {
      customStyles: {
        container: {
          backgroundColor: colors.successCalendar,
        },
        text: {
          color: colors.card,
          fontWeight: "700",
        },
      },
    };
  });

  if (selectedDate && !result[selectedDate]) {
    result[selectedDate] = {
      customStyles: {
        container: {
          backgroundColor: colors.primaryLight,
        },
        text: {
          color: colors.primaryDark,
          fontWeight: "700",
        },
      },
    };
  }

  if (!result[today]) {
    result[today] = {
      customStyles: {
        container: {
          backgroundColor: colors.primarySoft,
          borderWidth: 1,
          borderColor: colors.primaryBorder,
        },
        text: {
          color: colors.primaryDark,
          fontWeight: "700",
        },
      },
    };
  }

  return result;
}

function getLocalDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
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
