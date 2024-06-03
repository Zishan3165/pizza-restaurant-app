import React, { useContext } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import Context from "../store/context";
var id = 1;
function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [day, month, year].join("/");
}
const OrderHistoryRow = ({ row, reorder }) => {
  const { createdAt, totalPrice, isEcoupon } = row;
  let { nodes } = row?.orderItemsByOrderId;
  let context = useContext(Context);
  const unique = [...new Set(nodes?.map((item) => item?.pizzaId))];
  let newArray = [];
  for (const id of unique) {
    let occurence = nodes?.filter((item) => item.pizzaId == id)?.length;
    let pizzaName = nodes?.find((item) => item.pizzaId == id)?.pizzaByPizzaId
      ?.pizzaName;
    let obj = { id, occurence, pizzaName };
    newArray.push(obj);
  }
  return (
    <View
      style={{
        overflowY: "auto",
        padding: "1rem",
        background: "#3A9E984A",
        height: 150,
        width: "100%",
        margin: 10,
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: 10,
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View style={{ height: 90 }}>
        <Text style={{ fontSize: 18 }}>Date : {formatDate(createdAt)}</Text>
        <Text style={{ fontSize: 18 }}>Total Price : ${totalPrice}</Text>
        <Text style={{ fontSize: 18 }}>
          Coupon Used : {isEcoupon ? "Yes" : "No"}
        </Text>
        {newArray?.map((item) => (
          <Text key={id++} style={{ fontSize: 18 }}>
            {item.occurence} x {item.pizzaName}{" "}
          </Text>
        ))}
      </View>
      <View
        style={{
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
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "center",
            width: "100%",
          }}
          onPress={() => reorder(nodes)}
        >
          <View>
            {" "}
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 14,
                color: "white",
                margin: "auto",
              }}
            >
              Reorder
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default OrderHistoryRow;
