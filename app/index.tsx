import * as DocumnetPicker from "expo-document-picker";
import { useState } from "react";
import { Button, Text, View } from "react-native";
import PDF from "react-native-pdf";

export default function Index() {
  const [fileUri, setFileUri] = useState<String | null>(null);
  const handlePick = async () => {
    const res = await DocumnetPicker.getDocumentAsync({});
    if (!res.canceled) {
      //@ts-ignore
      await setFileUri(res.uri);
      console.log(fileUri);
    } else {
      console.log("document selection cancled!");
    }
  };
  if (fileUri == "") {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Edit app/index.tsx to edit this screen.</Text>
        <Button onPress={handlePick} title="Select 📑"></Button>
      </View>
    );
  } else {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* @ts-ignore */}
        <PDF source={fileUri} style={{ flex: 1 }}></PDF>
      </View>
    );
  }
}
