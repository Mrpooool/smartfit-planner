import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { getExerciseById } from "../api/exerciseDbApi";
import { normalizeExerciseFromDb } from "../utils/normalizeExercise";
import { ActionDetailsView } from "../views/ActionDetailsView";
import { ActivityIndicator, Text, View } from "react-native";
import { colors } from "../theme";

/**
 * Presenter for viewing a single exercise from Explore.
 * Fetches exercise data by ID from ExerciseDB API.
 */
export default observer(function ExploreDetailPresenter() {
  var params = useLocalSearchParams();
  var exerciseId = params.id;

  var [exercise, setExercise] = useState(null);
  var [loading, setLoading] = useState(true);
  var [error, setError] = useState(null);

  useEffect(function fetchExerciseEffect() {
    if (!exerciseId) return;
    setLoading(true);
    setError(null);

    getExerciseById(exerciseId)
      .then(function onSuccessCB(data) {
        setExercise(normalizeExerciseFromDb(data));
        setLoading(false);
      })
      .catch(function onErrorCB(err) {
        setError(err);
        setLoading(false);
      });
  }, [exerciseId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 12, color: colors.textSecondary }}>Loading exercise…</Text>
      </View>
    );
  }

  if (error || !exercise) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 40 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", color: colors.textDark }}>
          Exercise not found
        </Text>
      </View>
    );
  }

  return <ActionDetailsView exercise={exercise} />;
});
