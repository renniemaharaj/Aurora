//This function returns a promise
function queryOrders(query) {
  if (query == "") {
    query = "-";
  }
  return new Promise((resolve, reject) => {
    sendAwait(
      "scripts/-list-orders.php",
      `passcode=${SHA256(
        controller.querySelector("#controllerCode").value
      )}&query=${query}&lookup=${
        document.querySelector("#display-all-orders-check").checked
      }`
    ).then((orderlist) => {
      try {
        resolve(JSON.parse(orderlist));
      } catch (e) {
        resolve("E1");
      }
    });
  });
}
