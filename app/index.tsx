import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import { useEffect, useState } from "react";
import { Button, Dimensions, StyleSheet, Text, View } from "react-native";
import PDF from "react-native-pdf";

const STORE_KEY = "@timetable_URI";

export default function Index() {
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadSavedUri();
  });

  const loadSavedUri = async () => {
    try {
      const savedUri = await AsyncStorage.getItem(STORE_KEY);
      if (savedUri !== null) {
        setFileUri(savedUri);
      }
    } catch (err) {
      console.error("error loading uri: ", err);
    } finally {
      setLoading(false);
    }
  };

  const saveUri = async (uri: string) => {
    try {
      await AsyncStorage.setItem(STORE_KEY, uri);
    } catch (err) {
      console.error("error saving URI: ", err);
    }
  };

  const handlePick = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });
    if (!res.canceled && res.assets && res.assets.length > 0) {
      setFileUri(res.assets[0].uri);
      saveUri(res.assets[0].uri);
      console.log(fileUri);
    } else {
      console.log("document selection cancled!");
    }
  };

  const handleReset = async () => {
    try {
      await AsyncStorage.removeItem(STORE_KEY);
      setFileUri(null);
    } catch (err) {
      console.error("error reseting URI", err);
    }
  };

  if (loading) {
    return (
      <View style={style.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (fileUri === null) {
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
        <Button title="Change File" onPress={handleReset} />
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
