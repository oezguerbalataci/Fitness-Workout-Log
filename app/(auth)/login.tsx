import React from "react";
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
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth, useSignIn, useSignUp, useOAuth } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { makeRedirectUri } from "expo-auth-session";
import { z } from "zod";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";

const CLERK_OAUTH_REDIRECT_URL = "powerlog://oauth-native-callback";

const signUpSchema = z.object({
  username: z.string().min(2, "Username is too short"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignUpForm = z.infer<typeof signUpSchema>;

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<SignUpForm>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<SignUpForm>({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

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
    console.log("Error details:", error);

    if (typeof error === "string") {
      Alert.alert("Error", error);
      return;
    }

    const err = error as {
      errors?: Array<{ message?: string; code?: string }> | string;
      message?: string;
    };

    if (Array.isArray(err.errors)) {
      const errorMessage =
        err.errors[0]?.message || "An error occurred during sign up";
      Alert.alert("Sign Up Error", errorMessage);
    } else if (err.message) {
      Alert.alert("Error", err.message);
    } else {
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }

    setIsLoading(false);
  };

  const onSignUpWithEmail = useCallback(async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      if (!signUp) {
        throw new Error("Sign up is not initialized");
      }

      // Start the sign-up process
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
        username: form.username,
      });

      // Send verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Show verification input
      setPendingVerification(true);
      setIsLoading(false);
    } catch (err) {
      handleError(err);
      setIsLoading(false);
    }
  }, [signUp, form]);

  const onVerifyCode = useCallback(async () => {
    if (!verificationCode) {
      Alert.alert("Error", "Please enter verification code");
      return;
    }

    if (!signUp) {
      Alert.alert("Error", "Sign up is not initialized");
      return;
    }

    try {
      setIsLoading(true);

      // Attempt to verify the email address using the code
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp?.status === "complete") {
        // Sign up is complete, set the session active
        await setSignUpActive({ session: completeSignUp.createdSessionId });

        // Navigate to the main app
        router.replace("/(tabs)");
      } else {
        Alert.alert("Error", "Invalid verification code");
      }
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [verificationCode, signUp, router]);

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
      // Force close any existing browser sessions
      await WebBrowser.coolDownAsync();

      const { createdSessionId, setActive, signIn, signUp } = await googleAuth({
        redirectUrl: CLERK_OAUTH_REDIRECT_URL,
      });

      if (!createdSessionId && signUp && !signIn) {
        // This is a new user, complete the sign up
        const completeSignUp = await signUp.create({
          strategy: "oauth_google",
          redirectUrl: CLERK_OAUTH_REDIRECT_URL,
        });

        if (completeSignUp.status === "complete") {
          await setActive!({ session: completeSignUp.createdSessionId });
          router.replace("/(tabs)");
        }
      } else if (!createdSessionId && signIn) {
        // Existing user, complete the sign in
        const completeSignIn = await signIn.create({
          strategy: "oauth_google",
          redirectUrl: CLERK_OAUTH_REDIRECT_URL,
        });

        await setActive!({ session: completeSignIn.createdSessionId });
        router.replace("/(tabs)");
      } else if (createdSessionId) {
        // Direct success case
        await setActive!({ session: createdSessionId });
        router.replace("/(tabs)");
      }

      // Force cleanup of the browser session
      await WebBrowser.coolDownAsync();
    } catch (err) {
      handleError(err);
    } finally {
      // Ensure the browser is cleaned up
      await WebBrowser.coolDownAsync();
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
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const bgColor = "bg-black";
  const textColor = "text-white";
  const inputBgColor = "bg-white";
  const secondaryTextColor = "text-gray-400";

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {pendingVerification ? (
            // Verification Code View
            <View className="py-8">
              <Text className="text-4xl font-bold text-white mb-2">
                Verify your email
              </Text>
              <Text className="text-lg text-gray-400 mb-8">
                Please enter the verification code sent to your email
              </Text>

              <View>
                <Text className="text-gray-400 text-base mb-2">
                  Verification Code
                </Text>
                <View className="bg-white rounded-2xl px-4 py-4 flex-row items-center">
                  <Ionicons
                    name="key-outline"
                    size={20}
                    color="#666"
                    className="mr-2"
                  />
                  <TextInput
                    placeholder="Enter verification code"
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    keyboardType="number-pad"
                    className="flex-1 text-black text-base"
                    placeholderTextColor="#666"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <TouchableOpacity
                className="bg-[#4CAF50] rounded-2xl py-4 mt-6"
                onPress={onVerifyCode}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-semibold text-lg">
                    Verify Email
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex-1 px-5 mt-6">
              <View className="mb-12">
                <Text className="text-4xl font-bold text-white mb-2">
                  Go ahead and set up your account
                </Text>
                <Text className="text-lg text-gray-500">
                  Sign {isRegistering ? "up" : "in"} to enjoy the best managing
                  experience
                </Text>
              </View>

              {/* Toggle Buttons */}
              <View className="bg-white/10 rounded-full p-1 flex-row mb-8">
                <TouchableOpacity
                  className={`flex-1 py-3 rounded-full ${
                    !isRegistering ? "bg-white" : "bg-transparent"
                  }`}
                  onPress={() => setIsRegistering(false)}
                >
                  <Text
                    className={`text-center font-medium ${
                      !isRegistering ? "text-black" : "text-white/50"
                    }`}
                  >
                    Login
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 py-3 rounded-full ${
                    isRegistering ? "bg-white" : "bg-transparent"
                  }`}
                  onPress={() => setIsRegistering(true)}
                >
                  <Text
                    className={`text-center font-medium ${
                      isRegistering ? "text-black" : "text-white/50"
                    }`}
                  >
                    Register
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="bg-white rounded-3xl p-6">
                {isRegistering && (
                  <View className="mb-4">
                    <Text className="text-gray-500 text-base mb-2">
                      Username
                    </Text>
                    <View className="flex-row items-center bg-gray-50 rounded-2xl p-4 shadow-sm">
                      <Ionicons
                        name="person-outline"
                        size={20}
                        color="#4CAF50"
                        style={{ marginRight: 8 }}
                      />
                      <TextInput
                        placeholder="Enter your username"
                        value={form.username}
                        onChangeText={(text: string) =>
                          setForm((prev) => ({ ...prev, username: text }))
                        }
                        className="flex-1 text-black text-base"
                        placeholderTextColor="#9ca3af"
                        autoCapitalize="none"
                      />
                    </View>
                    {formErrors.username && (
                      <Text className="text-red-500 text-sm mt-1">
                        {formErrors.username}
                      </Text>
                    )}
                  </View>
                )}

                <View className="mb-4">
                  <Text className="text-gray-500 text-base mb-2">
                    Email Address
                  </Text>
                  <View className="flex-row items-center bg-gray-50 rounded-2xl p-4 shadow-sm">
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color="#4CAF50"
                      style={{ marginRight: 8 }}
                    />
                    <TextInput
                      placeholder="Enter your email"
                      value={form.email}
                      onChangeText={(text: string) =>
                        setForm((prev) => ({ ...prev, email: text }))
                      }
                      keyboardType="email-address"
                      autoCapitalize="none"
                      className="flex-1 text-black text-base"
                      placeholderTextColor="#9ca3af"
                    />
                  </View>
                  {formErrors.email && (
                    <Text className="text-red-500 text-sm mt-1">
                      {formErrors.email}
                    </Text>
                  )}
                </View>

                <View className="mb-6">
                  <Text className="text-gray-500 text-base mb-2">Password</Text>
                  <View className="flex-row items-center bg-gray-50 rounded-2xl p-4 shadow-sm">
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color="#4CAF50"
                      style={{ marginRight: 8 }}
                    />
                    <TextInput
                      placeholder="Enter your password"
                      value={form.password}
                      onChangeText={(text: string) =>
                        setForm((prev) => ({ ...prev, password: text }))
                      }
                      secureTextEntry={!showPassword}
                      className="flex-1 text-black text-base"
                      placeholderTextColor="#9ca3af"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color="#9ca3af"
                      />
                    </TouchableOpacity>
                  </View>
                  {formErrors.password && (
                    <Text className="text-red-500 text-sm mt-1">
                      {formErrors.password}
                    </Text>
                  )}
                </View>

                <View className="flex-row justify-between items-center mb-6">
                  <TouchableOpacity
                    className="flex-row items-center"
                    onPress={() => setRememberMe(!rememberMe)}
                  >
                    <View
                      className={`w-5 h-5 rounded border ${
                        rememberMe
                          ? "bg-[#4CAF50] border-[#4CAF50]"
                          : "border-gray-300"
                      } mr-2 items-center justify-center`}
                    >
                      {rememberMe && (
                        <Ionicons name="checkmark" size={16} color="white" />
                      )}
                    </View>
                    <Text className="text-gray-500">Remember me</Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text className="text-[#4CAF50]">Forgot Password?</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  className="bg-[#4CAF50] rounded-full py-4 mb-6"
                  onPress={
                    isRegistering ? onSignUpWithEmail : onSignInWithEmail
                  }
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white text-center font-semibold text-lg">
                      {isRegistering ? "Sign Up" : "Login"}
                    </Text>
                  )}
                </TouchableOpacity>

                <View>
                  <View className="flex-row items-center mb-6">
                    <View className="flex-1 h-[1px] bg-gray-200" />
                    <Text className="mx-4 text-gray-500">Or login with</Text>
                    <View className="flex-1 h-[1px] bg-gray-200" />
                  </View>

                  <View className="flex-row gap-4">
                    <TouchableOpacity
                      className="flex-1 flex-row items-center justify-center py-3 border border-gray-200 rounded-full"
                      onPress={onSignInWithGoogle}
                    >
                      <MaterialCommunityIcons
                        name="google"
                        size={24}
                        color="#000"
                      />
                      <Text className="ml-2 font-medium text-black">
                        Google
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="flex-1 flex-row items-center justify-center py-3 border border-gray-200 rounded-full"
                      onPress={onSignInWithApple}
                    >
                      <Ionicons name="logo-apple" size={24} color="#000" />
                      <Text className="ml-2 font-medium text-black">Apple</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
