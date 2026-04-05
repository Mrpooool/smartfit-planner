import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { getExerciseImageSource } from "../../api/exerciseDbApi";
import { colors, radius } from "../../theme";

export function ExerciseImage({
  exercise,
  style,
  contentFit = "contain",
  variant = "large",
  allowImageEndpointFallback,
}) {
  const [sourceIndex, setSourceIndex] = useState(0);
  // 按优先级准备图片源列表：先用搜索结果自带的 gifUrl，再退回到 ExerciseDB 图片接口。
  const shouldAllowImageEndpointFallback =
    allowImageEndpointFallback ?? variant !== "compact";
  const imageSources = buildImageSources(exercise, shouldAllowImageEndpointFallback);
  // sourceIndex 指向当前正在尝试的图源；加载失败时会递增，形成回退链路。
  const source = imageSources[sourceIndex];
  const isCompact = variant === "compact";
  // 占位卡片的配色和图标会根据动作肌群做一个简单映射。
  const placeholderTheme = getPlaceholderTheme(exercise);
  const title = formatDisplayLabel(exercise?.targetMuscle || exercise?.bodyPart || "Exercise");
  const subtitle = formatDisplayLabel(exercise?.equipment || "Demo unavailable");

  useEffect(function resetImageSourceACB() {
    // 切换到新动作时，重置回第一个图源，避免沿用上一个动作的失败状态。
    setSourceIndex(0);
  }, [exercise?.exerciseDbId, exercise?.gifUrl, exercise?.id]);

  useEffect(function logFallbackReasonACB() {
    if (!__DEV__) {
      return;
    }

    if (!exercise?.gifUrl && (exercise?.exerciseDbId || exercise?.id)) {
      console.log("[ExerciseImage] Missing gifUrl", {
        id: exercise?.exerciseDbId || exercise?.id,
        name: exercise?.name || "",
        variant: variant,
        imageEndpointFallbackEnabled: shouldAllowImageEndpointFallback,
      });
    }
  }, [
    exercise?.exerciseDbId,
    exercise?.gifUrl,
    exercise?.id,
    exercise?.name,
    shouldAllowImageEndpointFallback,
    variant,
  ]);

  if (source) {
    return (
      <Image
        source={source}
        style={style}
        contentFit={contentFit}
        cachePolicy="memory-disk"
        transition={120}
        onError={function onImageErrorACB() {
          if (__DEV__) {
            console.log("[ExerciseImage] Image source failed, trying next fallback", {
              id: exercise?.exerciseDbId || exercise?.id,
              name: exercise?.name || "",
              sourceUri: source?.uri || "",
              nextSourceUri: imageSources[sourceIndex + 1]?.uri || "",
              variant: variant,
            });
          }

          // 当前图源失败时切到下一个；如果越界了，source 会变成 undefined，
          // 组件就会走下面的占位渲染分支。
          setSourceIndex(function nextSourceIndexCB(currentIndex) {
            return currentIndex + 1;
          });
        }}
      />
    );
  }

  return (
    <LinearGradient
      // LinearGradient 可以理解为“带渐变背景的 View”。
      // 所以这个默认占位图不是静态资源，而是这里直接把背景绘制出来。
      colors={placeholderTheme.colors}
      // 从左上角渐变到右下角。
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      // React Native 里 style 可以传数组，后面的样式会覆盖前面的同名属性。
      style={[styles.placeholder, style]}
    >
      <View
        // 这一层负责画中间的圆形徽章：固定宽高 + 一半的圆角 = 圆。
        style={[
          styles.iconBadge,
          isCompact ? styles.iconBadgeCompact : null,
          { borderColor: placeholderTheme.accent },
        ]}
      >
        <Ionicons
          // Ionicons 是图标字体组件，name 决定具体画哪个图标。
          name={placeholderTheme.icon}
          size={isCompact ? 20 : 30}
          color={placeholderTheme.accent}
        />
      </View>

      {isCompact ? null : (
        <>
          {/* 标题和副标题也是占位图的一部分，不是图片里自带的文字。 */}
          <Text style={styles.placeholderTitle}>{title}</Text>
          <Text style={styles.placeholderSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </>
      )}
    </LinearGradient>
  );
}

function buildImageSources(exercise, allowImageEndpointFallback) {
  const sources = [];
  const seenUris = new Set();
  const imageId = exercise?.exerciseDbId || exercise?.id;

  if (exercise?.gifUrl) {
    // expo-image 的 source 常见写法是 { uri: "https://..." }。
    sources.push({ uri: exercise.gifUrl });
  }

  if (allowImageEndpointFallback && imageId) {
    sources.push(getExerciseImageSource(imageId, 360));
  }

  return sources.filter(function filterDuplicateSourcesCB(source) {
    const uri = source?.uri;
    // 没有 uri 或者已经出现过的地址都过滤掉，避免重复尝试同一张图。
    if (!uri || seenUris.has(uri)) {
      return false;
    }
    seenUris.add(uri);
    return true;
  });
}

function getPlaceholderTheme(exercise) {
  const muscleText = `${exercise?.targetMuscle || ""} ${exercise?.bodyPart || ""}`.toLowerCase();

  // 缺图时按大肌群给不同颜色和图标，让占位状态也能传达一点语义。
  if (containsAny(muscleText, ["chest", "shoulder", "tricep"])) {
    return {
      colors: ["#eef2ff", "#e0e7ff"],
      accent: colors.primaryDark,
      icon: "barbell-outline",
    };
  }

  if (containsAny(muscleText, ["back", "lat", "bicep", "forearm"])) {
    return {
      colors: ["#ecfeff", "#cffafe"],
      accent: "#0f766e",
      icon: "body-outline",
    };
  }

  if (containsAny(muscleText, ["quad", "hamstring", "glute", "calf", "leg"])) {
    return {
      colors: ["#eff6ff", "#dbeafe"],
      accent: "#1d4ed8",
      icon: "walk-outline",
    };
  }

  if (containsAny(muscleText, ["waist", "ab", "core"])) {
    return {
      colors: ["#fffbeb", "#fef3c7"],
      accent: "#b45309",
      icon: "pulse-outline",
    };
  }

  return {
    colors: ["#f3f4f6", "#e5e7eb"],
    accent: colors.textSecondary,
    icon: "fitness-outline",
  };
}

function containsAny(text, words) {
  return words.some(function matchesWordCB(word) {
    // some: 只要有一个关键词命中就返回 true。
    return text.includes(word);
  });
}

function formatDisplayLabel(value) {
  return String(value || "")
    // 把 snake_case / kebab-case 转成更适合显示的文本。
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    // 每个单词首字母大写。
    .replace(/\b\w/g, function capitalizeCB(letter) {
      return letter.toUpperCase();
    });
}

const styles = StyleSheet.create({
  placeholder: {
    // 给渐变容器加圆角，这样整张占位卡片边缘是圆的。
    borderRadius: radius.md,
    // 子元素在容器中水平/垂直居中，所以图标和文案会出现在中间。
    alignItems: "center",
    justifyContent: "center",
    // 配合 borderRadius，把超出圆角边界的渐变内容裁掉。
    overflow: "hidden",
  },
  iconBadge: {
    // 固定宽高的正方形。
    width: 58,
    height: 58,
    // 半径等于宽高的一半时，方块会变成圆。
    borderRadius: 29,
    // 这是圆圈描边；颜色不是写死的，而是下面通过 borderColor 动态传入。
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    // 给圆圈里加一层半透明白底，让图标从渐变背景里浮出来。
    backgroundColor: "rgba(255,255,255,0.72)",
    marginBottom: 12,
  },
  iconBadgeCompact: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginBottom: 0,
  },
  placeholderTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  placeholderSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "600",
  },
});
