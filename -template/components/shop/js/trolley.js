//This is the trolley

var ShoppingCart = Array();
//Checkout onlick scrolls contact form into view
document.querySelector("#checkout-scroll").onclick = () => {
  document.querySelector("#contact").scrollIntoView();
};

//Submit logic for contact form submit
document.querySelector("#contact").onsubmit = () => {
  const contact_form = document.querySelector("#contact");
  let order = Object();
  order.Trolley = ShoppingCart;
  order.Name = contact_form.querySelector("#name").value;
  order.Email = contact_form.querySelector("#email").value;
  order.Phone = contact_form.querySelector("#phone").value;
  order.DeliveryType = document.querySelector("#deliveryOption").value;
  order.Address = contact_form.querySelector("#address").value;
  order.Comment = contact_form.querySelector("#comment").value;
  order.Seen = false;
  sendAwait("scripts/new-order.php", `order=${JSON.stringify(order)}`).then(
    (status) => {
      if (parseInt(status)) {
        ShoppingCart = Array();
        updateShoppingCart();
        alert(
          `Thank you for your order, ${order.Name}. Your order number is ${status}. We will contact you soon.
                -Aurora's
            `
        );
      } else {
        console.log(status);
        alert(
          "We're sorry, something went wrong. We can not process your order right now."
        );
      }
    }
  );
  return false;
};

//function for toggling address field
function toggleAddressField() {
  const deliveryOption = document.getElementById("deliveryOption");
  const addressField = document.getElementById("addressField");
  if (deliveryOption.value === "delivery") {
    addressField.style.display = "block";
  } else {
    addressField.style.display = "none";
  }
}

//Function for querying products
function queryProducts(query) {
  return new Promise((resolve, reject) => {
    sendAwait(
      "scripts/list-products.php?query=" + encodeURIComponent(query)
    ).then((products) => {
      try {
        products = JSON.parse(products);
      } catch (error) {
        console.log("Error: Query results were not in JSON format");
        console.log(products);
      }
      resolve(products);
    });
  });
}

setInterval(() => {
  queryOrders("").then((orderlist) => {
    if (orderlist == "E1") {
      return;
    }
    try {
      if (orderlist.length > 0) {
        buyNewController();
        displayOrders(orderlist);
      }
    } catch (e) {
      console.log(e);
    }
  });
}, 10000);

// Function to update the overall cart total
function updateCartTotal() {
  let cart_items = document.getElementsByClassName("cart-item");
  let cartTotalAmountElement =
    document.getElementsByClassName("cart-total-amount")[0];
  let total = 0;

  for (let item of cart_items) {
    let itemTotal = parseFloat(
      item.getElementsByClassName("item-total")[0].textContent
    );
    total += itemTotal;
  }
  // Update the cart total element
  cartTotalAmountElement.textContent = total.toFixed(2);
}

//Function updates a cart item's overall quantity
function UpdateCartItemQuantity(ID, quant) {
  ShoppingCart.forEach((product) => {
    if (product.ID == ID) {
      product.desiredquant = quant;
    }
  });
}
// This function re generates the entire shopping cart by starting from scratch
function UpdateShoppingCart(viewing) {
  let cart_items = document.getElementsByClassName("cart-items")[0];
  cart_items.innerHTML = "";

  ShoppingCart.forEach((item) => {
    let cartItemHTML = `
            ${
              cart_items.innerHTML == ""
                ? ""
                : '<div class="cart-seperator">+</div>'
            }
            <li class= "cart-item">
                <div class="item-info"><h4>${item.title}</h4>
                    <br>
                    <p class="item-description">${item.description} </p> 
                </div>
                <div class="item-price">
                    Unit-Price: $${item.charge}
                </div>
                <div class="item-quantity">
                    <input id="--${
                      item.ID
                    }" class="cart-quant" type="number" value="${
      item.desiredquant ? item.desiredquant : 1
    }" min="1" data-charge="${item.charge}">
                </div>
                <div class="item-total">
                    ${
                      item.desiredquant
                        ? item.charge * item.desiredquant
                        : item.charge
                    }
                </div>
            </li > 
            `;
    if (viewing) {
      document.querySelector("#checkout-scroll").disabled = viewing
        ? true
        : false;
    }
    cart_items.innerHTML += cartItemHTML;
    setTimeout(() => {
      cart_items.querySelector(`#--${item.ID}`).onchange = (event) => {
        const child = event.target;
        updateCartItemQuantity(
          child.id.replace("--", ""),
          parseInt(child.value)
        );
      };
    }, 100);
  });
}

function QueryTrolley(orderID) {
  return new Promise((resolve, reject) => {
    sendAwait("scripts/query-trolley.php", `ID=${orderID}`).then((trolley) => {
      resolve(trolley);
    });
  });
}

//This function displays orders
function DisplayOrders(orders) {
  var table = document.getElementById("controller-orders-list");
  table.innerHTML = "";
  for (var i = 0; i < orders.length; i++) {
    var row = table.insertRow(i);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    var cell7 = row.insertCell(6);
    var cell8 = row.insertCell(7);
    var cell9 = row.insertCell(8);
    var cell10 = row.insertCell(9);
    var cell11 = row.insertCell(10);
    cell1.innerHTML = orders[i].ID;
    cell2.innerHTML = orders[i].Name;
    cell3.innerHTML = orders[i].Email;
    cell4.innerHTML = orders[i].Phone;
    cell5.innerHTML = orders[i].DeliveryType;
    cell6.innerHTML = `${orders[i].Address ? orders[i].Address : "void"}`;
    cell7.innerHTML = orders[i].Comment;
    cell8.innerHTML = orders[i]["time-added"];
    if (orders[i].Trolley.length) {
      let total = 0;
      orders[i].Trolley.forEach((item) => {
        total = item.charge;
        if (item.desiredquant) {
          total *= item.desiredquant;
        }
        cell9.innerHTML = "$" + total;
      });
      cell10.innerHTML = `<span id="see_${orders[i].ID}" class="orders-action">See</span>`;
    } else {
      cell9.innerHTML = "void";
      cell10.innerHTML = "empty";
    }
    cell11.innerHTML = `<span id="dismiss_${orders[i].ID}" class="orders-action">Dismiss</span>`;
  }
  var row = table.insertRow(0);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  var cell5 = row.insertCell(4);
  var cell6 = row.insertCell(5);
  var cell7 = row.insertCell(6);
  var cell8 = row.insertCell(7);
  var cell9 = row.insertCell(8);
  var cell10 = row.insertCell(9);
  var cell11 = row.insertCell(10);
  cell1.innerHTML = "ID";
  cell2.innerHTML = "Name";
  cell3.innerHTML = "Email";
  cell4.innerHTML = "Phone";
  cell5.innerHTML = "Type";
  cell6.innerHTML = "Address";
  cell7.innerHTML = "Comment";
  cell8.innerHTML = "Time";
  cell9.innerHTML = "Total";
  cell10.innerHTML = "Trolley";
  cell11.innerHTML = "Action";
  const actions = table.querySelectorAll(".orders-action");
  actions.forEach((action) => {
    const cmd = action.id.split("_");
    if (cmd[0] && cmd[0] == "see") {
      action.onclick = () => {
        queryTrolley(parseInt(cmd[1])).then((trolley) => {
          try {
            ShoppingCart = JSON.parse(trolley);
            hideController();
            document.querySelector("#aurora-trolley").scrollIntoView();
            updateShoppingCart(true);
          } catch (e) {
            console.log(e);
          }
        });
      };
    } else {
      action.onclick = () => {
        sendAwait(
          "scripts/-dismiss-order.php",
          `ID=${parseInt(cmd[1])}&passcode=${SHA256(
            controller.querySelector("#controllerCode").value
          )}`
        ).then((status) => {
          if (status == 0) {
            document.querySelector("#controller-list-orders").click();
          } else {
            console.log(status);
          }
        });
      };
    }
  });
}
