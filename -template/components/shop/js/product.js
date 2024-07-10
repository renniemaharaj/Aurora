// Update totals after all items are added
updateCartTotal();

// 4) Load now, products
queryProducts("").then((products) => {
  displayProducts(products);
});

//Form handling scripts...

//Logic for product searching
document
  .getElementById("query-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission
    const query = document.getElementById("query").value;
    queryProducts(query).then((products) => {
      displayProducts(products);
    });
  });

//Logic for handling input backspace into empty
document.querySelector("#query").onkeydown = () => {
  const query = document.querySelector("#query");
  if (query.value.length <= 1) {
    queryProducts("").then((products) => {
      displayProducts(products);
    });
  }
};

//function for displaying products
function displayProducts(products) {
  const showcase = document.querySelector("#showcase");

  //Possibly to be animated
  showcase.innerHTML = "";

  //If list is empty then display empty message
  if (products.length == 0) {
    showcase.innerHTML = "<h3>No products found</h3>";
    return;
  }

  // Assume products is an array of product objects
  products.forEach((product) => {
    const productDiv = buildProduct(product);
    showcase.appendChild(productDiv);

    // Attach event listener to the newly created button
    const btn_cart = productDiv.querySelector(".interested-button");
    if (!btn_cart) {
      return;
    }
    btn_cart.onclick = () => {
      btn_cart.classList.add("gentledismiss");
      ShoppingCart.push(product);
      setTimeout(() => {
        updateShoppingCart();
        btn_cart.remove();
      }, 1000);
    };
  });
}

//Build product using string literals
function buildProduct(product, editable) {
  // <img src="${product.thumbnails.length > 0 ? product.thumbnails[0] : 'path/to/default-thumbnail.jpg'}" alt="Product Thumbnail">
  // <p class="description">${product.description}</p>
  const productDiv = document.createElement("div");
  productDiv.className = "product";
  let productHTML = `
    <div class= "skeleton-image"></div>
    <h2 id="product-title">${product.title}</h2>
    <p id="product-price" class="price">$${
      product.charge
    } <span class="currency">${
    product.currency
  }</span> Quantity: <span id="product-quantity">${
    product["unit-quantity"]
  }</span></p>
    <div class="stock-container">
    <p class="stock ${product.stock ? "" : "out-of-stock"}">${
    product.stock ? "In Stock" : "Order Only"
  }</p>
    ${product.stock ? '<button class="interested-button">+ Cart</button>' : ""}
    ${editable ? '<br><button id="delete-button">remove</button>' : ""}
    </div>
    `;
  productDiv.innerHTML = productHTML;
  productDiv.id = product.ID;
  if (editable) {
    productDiv.querySelector("#delete-button").onclick = () => {
      sendAwait(
        "scripts/--product.php",
        `passcode=${SHA256(
          controller.querySelector("#controllerCode").value
        )}&ID=${productDiv.id}`
      ).then((response) => {
        if (response == "0") {
          productDiv.remove();
        }
      });
    };
  }
  if (product.thumbnails.length > 0) {
    const mediaslider = mediaSlider(
      product.thumbnails,
      productDiv.querySelector(".skeleton-image"),
      !0
    );
  }
  return productDiv;
}
