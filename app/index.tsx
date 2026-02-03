import * as DocumnetPicker from "expo-document-picker";
import { useState } from "react";
import { Button, Dimensions, StyleSheet, Text, View } from "react-native";
import PDF from "react-native-pdf";

export default function Index() {
  const [fileUri, setFileUri] = useState<string | null>(null);
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
      <View style={style.container}>
        <Text>No timetable selected yet!</Text>
        <Button onPress={handlePick} title="Select 📑"></Button>
      </View>
    );
  }
  return (
    <View style={style.container}>
      {/* @ts-ignore */}
      <PDF
        trustAllCerts={false}
        source={{ uri: fileUri || undefined, cache: true }}
        style={style.pdf}
        onLoadComplete={(numberOfPages) => {
          console.log(`Number Of pages: ${numberOfPages}`);
        }}
        onError={(err) => {
          console.log("PDF error: ", err);
        }}
      />
      {/*button to reset (i might need it)*/}
      <View style={{ position: "absolute", bottom: 20 }}>
        <Button title="Change File" onPress={() => setFileUri(null)} />
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
