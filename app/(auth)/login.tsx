import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth, useSignIn, useSignUp, useOAuth } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import { z } from "zod";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

const CLERK_OAUTH_REDIRECT_URL = "powerlog://oauth-native-callback";

const signUpSchema = z.object({
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignUpForm = z.infer<typeof signUpSchema>;

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<SignUpForm>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<SignUpForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { signIn, setActive: setSignInActive } = useSignIn();
  const { signUp, setActive: setSignUpActive } = useSignUp();
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: "oauth_apple" });

  const validateForm = () => {
    try {
      if (isRegistering) {
        signUpSchema.parse(form);
      } else {
        z.object({
          email: z.string().email("Invalid email address"),
          password: z.string().min(1, "Password is required"),
        }).parse(form);
      }
      setFormErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Partial<SignUpForm> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            errors[error.path[0] as keyof SignUpForm] = error.message;
          }
        });
        setFormErrors(errors);
      }
      return false;
    }
  };

  const handleError = (error: unknown) => {
    const err = error as { errors?: Array<{ message: string }> };
    const errorMessage = err.errors?.[0]?.message || "An error occurred";
    Alert.alert("Error", errorMessage);
    setIsLoading(false);
  };

  const onSignUpWithEmail = useCallback(async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      if (!signUp) return;

      const response = await signUp.create({
        firstName: form.firstName,
        lastName: form.lastName,
        emailAddress: form.email,
        password: form.password,
      });

      await response.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      Alert.alert(
        "Verification Required",
        "Please check your email for a verification code.",
        [
          {
            text: "OK",
            onPress: () => {
              // Reset form and switch to login
              setIsRegistering(false);
              setForm({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
              });
            },
          },
        ]
      );
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [signUp, form]);

  const onSignInWithEmail = useCallback(async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      if (!signIn) return;

      const completeSignIn = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      await setSignInActive({ session: completeSignIn.createdSessionId });
      router.replace("/(tabs)");
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [signIn, form, router]);

  const onSignInWithGoogle = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await googleAuth({
        redirectUrl: CLERK_OAUTH_REDIRECT_URL,
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (err) {
      handleError(err);
    }
  }, [googleAuth, router]);

  const onSignInWithApple = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await appleAuth({
        redirectUrl: CLERK_OAUTH_REDIRECT_URL,
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (err) {
      handleError(err);
    }
  }, [appleAuth, router]);

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0066FF" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="py-12">
            <Text className="text-4xl font-bold text-gray-900 mb-2">
              {isRegistering ? "Create Account" : "Welcome Back"}
            </Text>
            <Text className="text-lg text-gray-600">
              {isRegistering
                ? "Sign up to start tracking your workouts"
                : "Sign in to continue tracking your workouts"}
            </Text>
          </View>

          {isRegistering ? (
            <View className="space-y-4">
              <View className="space-y-2">
                <Text className="text-gray-600 text-base font-medium px-1">
                  First Name
                </Text>
                <TextInput
                  placeholder="Enter your first name"
                  value={form.firstName}
                  onChangeText={(text: string) =>
                    setForm((prev) => ({ ...prev, firstName: text }))
                  }
                  className={`w-full px-4 py-3 border rounded-xl bg-white ${
                    formErrors.firstName ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholderTextColor="#9ca3af"
                />
                {formErrors.firstName && (
                  <Text className="text-red-500 text-sm px-1">
                    {formErrors.firstName}
                  </Text>
                )}
              </View>

              <View className="space-y-2">
                <Text className="text-gray-600 text-base font-medium px-1">
                  Last Name
                </Text>
                <TextInput
                  placeholder="Enter your last name"
                  value={form.lastName}
                  onChangeText={(text: string) =>
                    setForm((prev) => ({ ...prev, lastName: text }))
                  }
                  className={`w-full px-4 py-3 border rounded-xl bg-white ${
                    formErrors.lastName ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholderTextColor="#9ca3af"
                />
                {formErrors.lastName && (
                  <Text className="text-red-500 text-sm px-1">
                    {formErrors.lastName}
                  </Text>
                )}
              </View>

              <View className="space-y-2">
                <Text className="text-gray-600 text-base font-medium px-1">
                  Email
                </Text>
                <TextInput
                  placeholder="Enter your email"
                  value={form.email}
                  onChangeText={(text: string) =>
                    setForm((prev) => ({ ...prev, email: text }))
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className={`w-full px-4 py-3 border rounded-xl bg-white ${
                    formErrors.email ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholderTextColor="#9ca3af"
                />
                {formErrors.email && (
                  <Text className="text-red-500 text-sm px-1">
                    {formErrors.email}
                  </Text>
                )}
              </View>

              <View className="space-y-2">
                <Text className="text-gray-600 text-base font-medium px-1">
                  Password
                </Text>
                <View className="relative">
                  <TextInput
                    placeholder="Create a password"
                    value={form.password}
                    onChangeText={(text: string) =>
                      setForm((prev) => ({ ...prev, password: text }))
                    }
                    secureTextEntry={!showPassword}
                    className={`w-full px-4 py-3 border rounded-xl bg-white ${
                      formErrors.password ? "border-red-500" : "border-gray-200"
                    }`}
                    placeholderTextColor="#9ca3af"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3"
                  >
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={24}
                      color="#6b7280"
                    />
                  </TouchableOpacity>
                </View>
                {formErrors.password && (
                  <Text className="text-red-500 text-sm px-1">
                    {formErrors.password}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                onPress={onSignUpWithEmail}
                disabled={isLoading}
                className="w-full bg-[#0066FF] py-4 rounded-full mt-4"
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-center font-semibold text-white text-lg">
                    Create Account
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View className="space-y-4">
              <View className="space-y-2">
                <Text className="text-gray-600 text-base font-medium px-1">
                  Email
                </Text>
                <TextInput
                  placeholder="Enter email address"
                  value={form.email}
                  onChangeText={(text: string) =>
                    setForm((prev) => ({ ...prev, email: text }))
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className={`w-full px-4 py-3 border rounded-xl bg-white ${
                    formErrors.email ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholderTextColor="#9ca3af"
                />
                {formErrors.email && (
                  <Text className="text-red-500 text-sm px-1">
                    {formErrors.email}
                  </Text>
                )}
              </View>

              <View className="space-y-2">
                <Text className="text-gray-600 text-base font-medium px-1">
                  Password
                </Text>
                <View className="relative">
                  <TextInput
                    placeholder="Enter your password"
                    value={form.password}
                    onChangeText={(text: string) =>
                      setForm((prev) => ({ ...prev, password: text }))
                    }
                    secureTextEntry={!showPassword}
                    className={`w-full px-4 py-3 border rounded-xl bg-white ${
                      formErrors.password ? "border-red-500" : "border-gray-200"
                    }`}
                    placeholderTextColor="#9ca3af"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3"
                  >
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={24}
                      color="#6b7280"
                    />
                  </TouchableOpacity>
                </View>
                {formErrors.password && (
                  <Text className="text-red-500 text-sm px-1">
                    {formErrors.password}
                  </Text>
                )}
              </View>

              <View className="flex-row justify-between items-center">
                <TouchableOpacity
                  onPress={() => setRememberMe(!rememberMe)}
                  className="flex-row items-center space-x-2"
                >
                  <View
                    className={`w-5 h-5 rounded-sm border flex items-center justify-center ${
                      rememberMe
                        ? "bg-[#0066FF] border-[#0066FF]"
                        : "border-gray-300"
                    }`}
                  >
                    {rememberMe && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </View>
                  <Text className="text-gray-600">Remember Me?</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text className="text-gray-600">Forgot Password</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={onSignInWithEmail}
                disabled={isLoading}
                className="w-full bg-[#0066FF] py-4 rounded-full mt-4"
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-center font-semibold text-white text-lg">
                    Login
                  </Text>
                )}
              </TouchableOpacity>

              <View className="mt-6 space-y-4">
                <View className="flex-row items-center">
                  <View className="flex-1 h-[1px] bg-gray-200" />
                  <Text className="mx-4 text-gray-500 text-sm">
                    or continue with
                  </Text>
                  <View className="flex-1 h-[1px] bg-gray-200" />
                </View>

                <View className="flex-row space-x-4">
                  <TouchableOpacity
                    onPress={onSignInWithGoogle}
                    disabled={isLoading}
                    className="flex-1 flex-row items-center justify-center space-x-2 py-3 border border-gray-200 rounded-full"
                  >
                    <Ionicons name="logo-google" size={20} color="#000" />
                    <Text className="font-medium">Google</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={onSignInWithApple}
                    disabled={isLoading}
                    className="flex-1 flex-row items-center justify-center space-x-2 py-3 border border-gray-200 rounded-full"
                  >
                    <Ionicons name="logo-apple" size={20} color="#000" />
                    <Text className="font-medium">Apple</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          <View className="py-8">
            <TouchableOpacity
              onPress={() => {
                setIsRegistering(!isRegistering);
                setForm({
                  firstName: "",
                  lastName: "",
                  email: "",
                  password: "",
                });
                setFormErrors({});
              }}
              className="flex-row justify-center"
            >
              <Text className="text-gray-600">
                {isRegistering
                  ? "Already have an account? "
                  : "New to PowerLog? "}
              </Text>
              <Text className="text-[#0066FF] font-medium">
                {isRegistering ? "Login" : "Create Account"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
