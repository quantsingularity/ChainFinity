import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../theme/ThemeContext";
import { brand, radius, spacing, typography } from "../../theme/theme";

// ── Screen wrapper ───────────────────────────────────────────────────────────

interface ScreenProps extends ScrollViewProps {
  scroll?: boolean;
  padded?: boolean;
  children: React.ReactNode;
  edges?: ("top" | "bottom" | "left" | "right")[];
}

export const Screen = ({
  scroll = false,
  padded = true,
  children,
  contentContainerStyle,
  edges = ["bottom"],
  style,
  ...rest
}: ScreenProps) => {
  const { theme } = useTheme();
  const base: ViewStyle = {
    flex: 1,
    backgroundColor: theme.colors.background,
  };
  const pad = padded ? { padding: spacing.xl } : undefined;

  if (scroll) {
    return (
      <SafeAreaView style={base} edges={edges}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[pad, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          {...rest}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[base, pad, style]} edges={edges}>
      {children}
    </SafeAreaView>
  );
};

// ── Typography ───────────────────────────────────────────────────────────────

type Variant = keyof typeof typography;
interface TextBaseProps extends TextProps {
  variant?: Variant;
  color?: "primary" | "secondary" | "muted" | "brand" | "success" | "error";
  center?: boolean;
  style?: StyleProp<TextStyle>;
}

export const AppText = ({
  variant = "body",
  color = "primary",
  center,
  style,
  children,
  ...rest
}: TextBaseProps) => {
  const { theme } = useTheme();
  const colorMap: Record<string, string> = {
    primary: theme.colors.textPrimary,
    secondary: theme.colors.textSecondary,
    muted: theme.colors.textMuted,
    brand: theme.colors.primary,
    success: theme.colors.success,
    error: theme.colors.error,
  };
  return (
    <Text
      style={[
        typography[variant] as TextStyle,
        { color: colorMap[color] },
        center && { textAlign: "center" },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};

// ── Card ─────────────────────────────────────────────────────────────────────

interface CardProps extends ViewProps {
  children: React.ReactNode;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Card = ({
  children,
  padded = true,
  style,
  ...rest
}: CardProps) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderRadius: radius.lg,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.colors.border,
          padding: padded ? spacing.lg : 0,
        },
        theme.mode === "light" && styles.lightShadow,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

// ── Gradient surfaces ────────────────────────────────────────────────────────

export const GradientCard = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => (
  <LinearGradient
    colors={[brand.gradientStart, brand.gradientEnd]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[{ borderRadius: radius.lg, padding: spacing.xl }, style]}
  >
    {children}
  </LinearGradient>
);

// ── Button ───────────────────────────────────────────────────────────────────

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline" | "ghost" | "danger" | "secondary";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
}

export const Button = ({
  title,
  onPress,
  variant = "primary",
  loading,
  disabled,
  fullWidth = true,
  accessibilityLabel,
  style,
  icon,
}: ButtonProps) => {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;

  const containerBase: ViewStyle = {
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: fullWidth ? "100%" : undefined,
    opacity: isDisabled ? 0.6 : 1,
  };

  const content = (labelColor: string) => (
    <>
      {loading ? (
        <ActivityIndicator color={labelColor} />
      ) : (
        <>
          {icon}
          <Text
            style={[
              typography.bodyStrong as TextStyle,
              { color: labelColor, marginLeft: icon ? spacing.sm : 0 },
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </>
  );

  if (variant === "primary") {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
        style={[{ width: fullWidth ? "100%" : undefined }, style]}
      >
        <LinearGradient
          colors={[brand.gradientStart, brand.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[containerBase]}
        >
          {content(brand.onPrimary)}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const variantStyles: Record<
    string,
    { bg: string; border?: string; label: string }
  > = {
    outline: {
      bg: "transparent",
      border: theme.colors.primary,
      label: theme.colors.primary,
    },
    secondary: {
      bg: "transparent",
      border: theme.colors.secondary,
      label: theme.colors.secondary,
    },
    ghost: { bg: theme.colors.surfaceLight, label: theme.colors.textPrimary },
    danger: {
      bg: "transparent",
      border: theme.colors.error,
      label: theme.colors.error,
    },
  };
  const v = variantStyles[variant];

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      style={[
        containerBase,
        {
          backgroundColor: v.bg,
          borderWidth: v.border ? 1 : 0,
          borderColor: v.border,
        },
        style,
      ]}
    >
      {content(v.label)}
    </TouchableOpacity>
  );
};

// ── Input ────────────────────────────────────────────────────────────────────

interface InputProps extends TextInputProps {
  label?: string;
  errorText?: string;
}

export const Input = ({ label, errorText, style, ...rest }: InputProps) => {
  const { theme } = useTheme();
  return (
    <View style={{ marginBottom: spacing.md }}>
      {label ? (
        <Text
          style={[
            typography.caption as TextStyle,
            {
              color: theme.colors.textSecondary,
              marginBottom: spacing.xs,
              fontWeight: "600",
            },
          ]}
        >
          {label}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor={theme.colors.textMuted}
        style={[
          {
            backgroundColor: theme.colors.surface,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: errorText ? theme.colors.error : theme.colors.border,
            color: theme.colors.textPrimary,
            paddingHorizontal: spacing.lg,
            paddingVertical: 13,
            fontSize: 16,
          },
          style,
        ]}
        {...rest}
      />
      {errorText ? (
        <Text
          style={[
            typography.caption as TextStyle,
            { color: theme.colors.error, marginTop: spacing.xs },
          ]}
        >
          {errorText}
        </Text>
      ) : null}
    </View>
  );
};

// ── Badge / Pill ─────────────────────────────────────────────────────────────

export const Badge = ({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "neutral" | "success" | "error" | "warning" | "brand";
}) => {
  const { theme } = useTheme();
  const toneMap: Record<string, string> = {
    neutral: theme.colors.textSecondary,
    success: theme.colors.success,
    error: theme.colors.error,
    warning: theme.colors.warning,
    brand: theme.colors.primary,
  };
  const c = toneMap[tone];
  return (
    <View
      style={{
        alignSelf: "flex-start",
        paddingHorizontal: spacing.md,
        paddingVertical: 3,
        borderRadius: radius.pill,
        backgroundColor: c + "22",
      }}
    >
      <Text
        style={{
          color: c,
          fontSize: 11,
          fontWeight: "700",
          textTransform: "capitalize",
        }}
      >
        {label}
      </Text>
    </View>
  );
};

// ── Section header ───────────────────────────────────────────────────────────

export const SectionHeader = ({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) => {
  const { theme } = useTheme();
  return (
    <View style={styles.sectionHeader}>
      <Text
        style={[
          typography.h3 as TextStyle,
          { color: theme.colors.textPrimary },
        ]}
      >
        {title}
      </Text>
      {action ? (
        <TouchableOpacity onPress={onAction}>
          <Text style={{ color: theme.colors.primary, fontWeight: "600" }}>
            {action}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

// ── Divider ──────────────────────────────────────────────────────────────────

export const Divider = ({ spacingV = spacing.md }: { spacingV?: number }) => {
  const { theme } = useTheme();
  return (
    <View
      style={{
        height: StyleSheet.hairlineWidth,
        backgroundColor: theme.colors.divider,
        marginVertical: spacingV,
      }}
    />
  );
};

// ── Empty state ──────────────────────────────────────────────────────────────

export const EmptyState = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => {
  const { theme } = useTheme();
  return (
    <View style={{ alignItems: "center", paddingVertical: spacing.xxxl }}>
      <Text
        style={[
          typography.h3 as TextStyle,
          { color: theme.colors.textSecondary },
        ]}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={{
            color: theme.colors.textMuted,
            marginTop: spacing.sm,
            textAlign: "center",
          }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
};

// ── Logo ─────────────────────────────────────────────────────────────────────

export const Logo = ({ size = 28 }: { size?: number }) => {
  const { theme } = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <LinearGradient
        colors={[brand.gradientStart, brand.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 3.5,
          alignItems: "center",
          justifyContent: "center",
          marginRight: spacing.sm,
        }}
      >
        <Text
          style={{ color: "#fff", fontWeight: "800", fontSize: size * 0.55 }}
        >
          C
        </Text>
      </LinearGradient>
      <Text
        style={{
          fontSize: size * 0.72,
          fontWeight: "800",
          color: theme.colors.textPrimary,
          letterSpacing: -0.5,
        }}
      >
        ChainFinity
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  lightShadow: {
    shadowColor: "#1a1a2e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
});
