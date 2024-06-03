import React from "react";
import { editIcon, deleteIcon } from "../constants/icons";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";

const PizzaRowAdmin = ({
  pizzaName,
  src,
  deletePizza,
  navigation,
  id,
  row,
}) => {
  const { smallPrice, mediumPrice, largePrice, defaultBase, defaultSize } = row;
  return (
    <View
      style={{
        padding: "1rem",
        background: "#3A9E984A",
        height: 175,
        margin: 10,
        borderRadius: 10,
        flexDirection: "row",
        padding: 10,
      }}
    >
      <View style={{ margin: "auto" }}>
        {" "}
        <Image
          source={src}
          style={{
            width: 90,
            height: 90,
            margin: 5,
            marginLeft: 10,
            borderRadius: 100 / 2,
          }}
        />
      </View>
      <View style={{ flex: 1, padding: 5 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 400,
            overflow: "auto",
            height: 50,
          }}
        >
          {pizzaName}
        </Text>
        <Text style={{ fontSize: 18, fontWeight: 400, marginTop: 5 }}>
          Base: {defaultBase?.charAt(0).toUpperCase() + defaultBase?.slice(1)}
        </Text>
        <Text style={{ fontSize: 18, fontWeight: 400, marginTop: 5 }}>
          Size: {defaultSize?.charAt(0).toUpperCase() + defaultSize?.slice(1)}
        </Text>
        <Text style={{ fontSize: 18, fontWeight: 700, marginTop: 20 }}>
          ${" "}
          {defaultSize === "small"
            ? smallPrice
            : defaultSize === "medium"
            ? mediumPrice
            : largePrice}
        </Text>
      </View>
      <TouchableOpacity
        tyle={{ margin: "auto" }}
        onPress={() => navigation.navigate("ModifyPizza", { pizzaObj: row })}
      >
        <Image
          source={editIcon}
          style={{
            width: 30,
            height: 30,
            margin: 5,
            marginLeft: 10,
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        tyle={{ margin: "auto" }}
        onPress={() => deletePizza(id)}
      >
        <Image
          source={deleteIcon}
          style={{
            width: 30,
            height: 30,
            margin: 5,
            marginLeft: 10,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    width: 350,
    height: 55,
    backgroundColor: "#4db6ac",
    margin: 10,
    padding: 8,
    color: "white",
    borderRadius: 14,
    fontSize: 18,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleTextStyle: {
    fontSize: 18,
    alignItems: "center",
    fontWeight: "bold",
    justifyContent: "center",
    paddingBottom: 20,
  },
  menuButtonStyle: {
    fontSize: 20,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#394F51",
    paddingBottom: 10,
    paddingTop: 10,
    height: 40,
    width: 200,
    margin: 5,
    flexDirection: "row",
  },
  buttonTextStyle: {
    fontWeight: "bold",
    fontSize: 14,
    color: "white",
    margin: "auto",
    marginLeft: 20,
  },
  spaceBetweenButton: {
    width: 20,
    height: 20,
  },
  registerCodeStyle: {
    marginTop: 20,
  },
});

export default PizzaRowAdmin;
