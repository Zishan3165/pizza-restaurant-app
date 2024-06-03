import React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { dealIcon } from "../constants/icons";

const ViewOrderRow = ({ row, onClick }) => {
  let {
    imageUrl,
    pizzaName,
    pizzaPrice,
    isDeal,
    dealDiscount,
    pizzaSize,
    pizzaBase,
  } = row;
  if (row.pizzaByPizzaId) {
    ({ imageUrl, pizzaName } = row.pizzaByPizzaId);
  }
  return (
    <TouchableOpacity onPress={() => onClick(rowId)}>
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
          {isDeal && (
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
          {isDeal && (
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
            $ {pizzaPrice}
          </Text>
        </View>
        <View style={{ margin: "auto", textAlign: "center" }}>
          <View>
            <Text style={{ fontWeight: 700 }}>
              Size{" "}
              <Text style={{ fontWeight: 400 }}>
                {pizzaSize?.charAt(0).toUpperCase() + pizzaSize?.slice(1)}
              </Text>
            </Text>
            <Text style={{ fontWeight: 700 }}>
              Base{" "}
              <Text style={{ fontWeight: 400 }}>
                {pizzaBase?.charAt(0).toUpperCase() + pizzaBase?.slice(1)}
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default ViewOrderRow;
