import React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { deleteDealIcon } from "../constants/icons";

const DealRow = ({ row, deleteDeal }) => {
  const { dealDiscount, pizzaByPizzaId, rowId } = row;
  const { pizzaName } = pizzaByPizzaId;
  return (
    <View
      style={{
        padding: "1rem",
        background: "#3A9E984A",
        height: 50,
        width: "90%",
        margin: 10,
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: 10,
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Text style={{ fontSize: 18 }}>
        {pizzaName} - {dealDiscount} % OFF
      </Text>
      <View
        style={{
          width: 30,
          height: 30,
          backgroundColor: "rgba(57, 79, 81, 1)",
        }}
      >
        <TouchableOpacity
          style={{
            width: 20,
            height: 20,
            margin: "auto",
          }}
          onPress={() => deleteDeal(rowId)}
        >
          <Image
            source={deleteDealIcon}
            style={{
              width: 20,
              height: 20,
              margin: "auto",
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default DealRow;
