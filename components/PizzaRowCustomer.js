import React, { useContext } from "react";
import { dealIcon } from "../constants/icons";
import Context from "../store/context";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";

const PizzaRowCustomer = ({ row, navigation }) => {
  const { addToCart } = useContext(Context);
  let {
    smallPrice,
    mediumPrice,
    largePrice,
    defaultBase,
    defaultSize,
    imageUrl,
    pizzaName,
    dealDiscount,
    rowId,
  } = row;
  if (row.pizzaByPizzaId) {
    ({
      smallPrice,
      mediumPrice,
      largePrice,
      defaultBase,
      defaultSize,
      imageUrl,
      pizzaName,
    } = row.pizzaByPizzaId);
  }
  if (dealDiscount) {
    smallPrice = smallPrice - (smallPrice * Number(dealDiscount)) / 100;
    mediumPrice = mediumPrice - (mediumPrice * Number(dealDiscount)) / 100;
    largePrice = largePrice - (largePrice * Number(dealDiscount)) / 100;
  }

  return (
    <View
      style={{
        padding: "1rem",
        background: "#3A9E984A",
        height: 115,
        margin: 10,
        borderRadius: 10,
        flexDirection: "row",
        padding: 10,
      }}
    >
      <View style={{ margin: "auto" }}>
        {" "}
        <Image
          source={imageUrl}
          style={{
            width: 90,
            height: 90,
            margin: 5,
            marginLeft: 10,
            borderRadius: 100 / 2,
          }}
        />
        {row.pizzaByPizzaId && (
          <Image
            source={dealIcon}
            style={{
              top: -10,
              left: -10,
              width: 40,
              height: 40,
              margin: 5,
              marginLeft: 10,
              position: "absolute",
              transform: "rotate(350deg)",
            }}
          />
        )}
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
        {dealDiscount && (
          <Text
            style={{
              fontSize: 18,
              fontWeight: 400,
              overflow: "auto",
              height: 50,
              color: "rgba(254, 13, 13, 1)",
            }}
          >
            {dealDiscount} % OFF
          </Text>
        )}
        <Text style={{ fontSize: 18, fontWeight: 700, marginTop: 20 }}>
          ${" "}
          {defaultSize === "small"
            ? smallPrice
            : defaultSize === "medium"
            ? mediumPrice
            : largePrice}
        </Text>
      </View>
      <View style={{ margin: "auto", textAlign: "center" }}>
        <View style={styles.addToOrderButtonStyle}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "center",
              width: "100%",
            }}
            onPress={() => {
              addToCart({
                ...row,
                pizzaId: row.pizzaByPizzaId ? row.pizzaId : rowId,
                pizzaQuantity: 1,
                pizzaPrice:
                  defaultSize === "small"
                    ? smallPrice
                    : defaultSize === "medium"
                    ? mediumPrice
                    : largePrice,
                pizzaSize: defaultSize,
                pizzaBase: defaultBase,
                isDeal: dealDiscount ? true : false,
              });
            }}
          >
            <View>
              {" "}
              <Text style={styles.buttonTextStyle}>Add To Order</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={{ fontWeight: 700 }}>
            Size{" "}
            <Text style={{ fontWeight: 400 }}>
              {defaultSize?.charAt(0).toUpperCase() + defaultSize?.slice(1)}
            </Text>
          </Text>
          <Text style={{ fontWeight: 700 }}>
            Base{" "}
            <Text style={{ fontWeight: 400 }}>
              {defaultBase?.charAt(0).toUpperCase() + defaultBase?.slice(1)}
            </Text>
          </Text>
        </View>
        <View style={styles.customizeButtonStyle}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "center",
              width: "100%",
            }}
            onPress={() =>
              navigation.navigate("CustomizePizza", { pizzaObj: row })
            }
          >
            <View>
              {" "}
              <Text style={styles.buttonTextStyle}>Customize</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
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
    height: 27,
    width: 100,
    margin: 5,
    flexDirection: "row",
  },
  buttonTextStyle: {
    fontWeight: "bold",
    fontSize: 14,
    color: "white",
    margin: "auto",
  },
  spaceBetweenButton: {
    width: 20,
    height: 20,
  },
  customizeButtonStyle: {
    fontSize: 14,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#394F51",
    paddingBottom: 10,
    paddingTop: 10,
    height: 20,
    width: 75,
    margin: "auto",
    marginTop: 5,
    flexDirection: "row",
    borderRadius: 10,
  },
  addToOrderButtonStyle: {
    fontSize: 20,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#394F51",
    paddingBottom: 10,
    paddingTop: 10,
    height: 27,
    width: 100,
    margin: "auto",
    flexDirection: "row",
  },
});

export default PizzaRowCustomer;
