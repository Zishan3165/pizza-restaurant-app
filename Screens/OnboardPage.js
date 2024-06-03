import React, { useContext } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import Context from "./../store/context";
import { pizzaCover } from "../constants/icons";
import { TouchableOpacity } from "react-native-gesture-handler";

const OnboardPage = ({ navigation }) => {
  let context = useContext(Context);
  if (context?.user?.userName) {
    if (context.user?.isAdmin) {
      navigation.navigate("AdminPage");
    } else {
      navigation.navigate("CustomerMenu");
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.imageContainerView}>
        <Image
          source={pizzaCover}
          resizeMode="cover"
          style={{
            width: 200,
            height: 200,
          }}
        />
      </View>
      <View style={styles.titleTextStyle}>
        <Text style={styles.titleTextStyle}>
          Cucina Vostra Pizza Restaurant
        </Text>
      </View>
      <View style={styles.buttonStyling}>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.buttonTextStyle}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.spaceBetweenButton} />
      <View style={styles.buttonStyling}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.buttonTextStyle}>SIGN IN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainerView: {
    justifyContent: "center",
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonStyling: {
    alignItems: "center",
    backgroundColor: "#394F51",
    justifyContent: "center",
    height: 40,
    width: 200,
  },
  buttonTextStyle: {
    fontWeight: "bold",
    fontSize: 14,
    color: "white",
  },
  spaceBetweenButton: {
    width: 20,
    height: 20,
  },
  titleTextStyle: {
    height: 100,
    width: 180,
    fontSize: 18,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
  },
});

OnboardPage.contextType = Context;
export default OnboardPage;
