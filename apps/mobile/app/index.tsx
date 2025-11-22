import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Progravity</Text>
      <Text>State of the Art Universal App</Text>
      <StatusBar style="auto" />
    </View>
  );
}
