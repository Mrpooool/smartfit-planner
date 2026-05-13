import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { colors, radius } from "../theme";

export function CalendarView(props) {
  const completedDates = props.completedDates || [];
  const workoutTimeLog = props.workoutTimeLog || {};
  const compact = Boolean(props.compact);

  function renderDayACB({ date, state }) {
    const dateString = date.dateString;
    const today = getLocalDateString();
    const isToday = dateString === today;
    const isSelected = dateString === props.selectedDate;
    const isCompleted = completedDates.includes(dateString);
    const isDisabled = state === "disabled";
    const workoutSeconds = workoutTimeLog[dateString] || 0;
    const hasCrown = workoutSeconds >= 3600; // 1 hour

    let containerStyle = styles.dayContainer;
    let textStyle = styles.dayText;

    if (isDisabled) {
      textStyle = styles.dayTextDisabled;
    } else if (isCompleted) {
      containerStyle = styles.dayContainerCompleted;
      textStyle = styles.dayTextCompleted;
    } else if (isSelected) {
      containerStyle = styles.dayContainerSelected;
      textStyle = styles.dayTextSelected;
    } else if (isToday) {
      containerStyle = styles.dayContainerToday;
      textStyle = styles.dayTextToday;
    }

    return (
      <TouchableOpacity
        style={styles.dayWrapper}
        onPress={function pressDayACB() {
          if (!isDisabled && props.onDatePress) {
            props.onDatePress(date);
          }
        }}
        activeOpacity={0.6}
      >
        <View style={[styles.dayContainer, containerStyle]}>
          {hasCrown ? (
            <Text style={styles.crownIcon}>👑</Text>
          ) : null}
          <Text style={[styles.dayText, textStyle]}>{date.day}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      <Calendar
        onDayPress={props.onDatePress}
        enableSwipeMonths={true}
        dayComponent={renderDayACB}
        theme={{
          calendarBackground: colors.card,
          monthTextColor: colors.textPrimary,
          textSectionTitleColor: colors.textSecondary,
          todayTextColor: colors.primaryDark,
          arrowColor: colors.primary,
          textMonthFontSize: compact ? 16 : 18,
          textDayHeaderFontSize: compact ? 13 : 14,
        }}
      />
    </View>
  );
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

  dayWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 42,
  },
  dayContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  dayContainerCompleted: {
    backgroundColor: colors.successCalendar,
  },
  dayContainerSelected: {
    backgroundColor: colors.primaryLight,
  },
  dayContainerToday: {
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  dayText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  dayTextCompleted: {
    color: colors.card,
    fontWeight: "700",
  },
  dayTextSelected: {
    color: colors.primaryDark,
    fontWeight: "700",
  },
  dayTextToday: {
    color: colors.primaryDark,
    fontWeight: "700",
  },
  dayTextDisabled: {
    color: colors.textTertiary,
  },
  crownIcon: {
    position: "absolute",
    top: -6,
    left: -4,
    fontSize: 12,
    transform: [{ rotate: "-25deg" }],
  },
});
