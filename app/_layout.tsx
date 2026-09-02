import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import "../styles/global.css";

export default function RootLayout() {
  return (
    <SafeAreaView>
      <View>
        <Text className="text-red-600 bg-card">The Empire behined it</Text>
      </View>
    </SafeAreaView>
  );
}
