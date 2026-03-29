// Uses react-native-chart-kit (install: npx expo install react-native-chart-kit react-native-svg)
// import { BarChart } from "react-native-chart-kit";

import { View, Text, StyleSheet } from "react-native";
import { colors, radius } from "../theme";

export function ChartView({ weeklyData }) {
  // weeklyData: number[] — workout count per week, e.g. [3, 5, 2, 4]
  // TODO: render BarChart with weeklyData
  // const chartData = {
  //   labels: weeklyData.map((_, i) => `W${i + 1}`),
  //   datasets: [{ data: weeklyData }],
  // };
  // return <BarChart data={chartData} width={...} height={180} ... />;

  return (
    <View style={styles.placeholder}>
      <Text style={styles.text}>📊 Weekly Chart (react-native-chart-kit)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: { height: 120, backgroundColor: colors.surface, borderRadius: radius.sm, alignItems: "center", justifyContent: "center", marginVertical: 12 },
  text: { color: colors.textTertiary },
});
