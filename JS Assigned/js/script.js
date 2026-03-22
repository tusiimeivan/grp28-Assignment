// ===============================
// GLOBAL CURRENCY
// ===============================
const currency = "UGX ";

// ===============================
// PRODUCT DATA
// ===============================
const products = [
    { id: 1, name: " Latitude E720 Laptop", price: 1800000, category: "Electronics", image: "Images/laptop.jpg" },
    { id: 2, name: "Iphone 17 Air", price: 5000000, category: "Phones", image: "Images/phone.jpg" },
    { id: 3, name: "Nike SuperRep Go", price: 70000, category: "Fashion", image: "Images/shoe.jpg" },
    { id: 4, name: "Black crew neck T-shirt", price: 25000, category: "Fashion",image: "Images/tshirt.jpg" },
    { id: 5, name: "Psychology of money, by Morgan Housel (Author)", price: 70000, category: "Books", image: "Images/book1.jpg" },
    { id: 6, name: "Headsets", price: 60000, category: "Electronics",image: "Images/headsets.jpg" },
    { id: 7, name: "Handbag" , price: 10000, category: "Fashion", image: "Images/bag2.jpg"},
    { id: 8, name: "Laws of Human Nature, By Rhobert Green(Author)", price: 50000, category: "Books" },
    { id: 9, name: "Samsung galaxy S21", price: 1500000, category: "Phones" , image: "Images/galaxy.jpg"},
    { id: 10, name: "Air Zoom", price: 150000, category: "Fashion", image: "Images/shoe2.jpg" },
];

// LOAD CART FROM LOCAL STORAGE

let cart = [];

try {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
} catch (error) {
    console.error("Error loading cart:", error);
    cart = [];
}


// UPDATE CART COUNT

function updateCartCount() {
    const countElement = document.getElementById("cart-count");
    if (countElement) {
        countElement.innerText = `(${cart.length})`;
    }
}


// DISPLAY PRODUCTS

function displayProducts(items) {
    const productList = document.getElementById("product-list");
    if (!productList) return;

    productList.innerHTML = "";

    items.forEach(product => {
        const div = document.createElement("div");

        div.innerHTML = `
            <img src="${product.image}" alt="${product.name}" style="width:150px; height:150px; object-fit:cover;">
            <h3>${product.name}</h3>
            <p>${currency}${product.price.toLocaleString()}</p>
            <small>${product.category}</small><br><br>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;

        productList.appendChild(div);
    });
}



// ADD TO CART

function addToCart(id) {
    try {
        const product = products.find(p => p.id === id);
        if (!product) throw "Product not found";

        const existing = cart.find(item => item.id === id);

        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        saveCart();
        updateCartCount();

    } catch (error) {
        alert(error);
    }
}


// SAVE CART

function saveCart() {
    try {
        localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
        console.error("Error saving cart:", error);
    }
}

// ===============================
// SEARCH
// ===============================
const searchInput = document.getElementById("search");
if (searchInput) {
    searchInput.addEventListener("input", function () {
        const value = this.value.toLowerCase();

        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(value)
        );

        displayProducts(filtered);
    });
}

// ===============================
// FILTER
// ===============================
const filterSelect = document.getElementById("filter");
if (filterSelect) {
    filterSelect.addEventListener("change", function () {
        const category = this.value;

        if (category === "all") {
            displayProducts(products);
        } else {
            const filtered = products.filter(p => p.category === category);
            displayProducts(filtered);
        }
    });
}

// ===============================
// DISPLAY CART
// ===============================
function displayCart() {
    const cartItems = document.getElementById("cart-items");
    const totalElement = document.getElementById("total");

    if (!cartItems) return;

    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        if (item.quantity <= 0) return;

        total += item.price * item.quantity;

        const div = document.createElement("div");

        div.innerHTML = `
            <h3>${item.name}</h3>
            <p>${currency}${item.price.toLocaleString()}</p>
            <button onclick="increase(${item.id})">+</button>
            <span>${item.quantity}</span>
            <button onclick="decrease(${item.id})">-</button>
            <button onclick="removeItem(${item.id})">Remove</button>
        `;

        cartItems.appendChild(div);
    });

    if (totalElement) {
        totalElement.innerText = "Total: " + currency + total.toLocaleString();
    }
}


// QUANTITY CONTROL

function increase(id) {
    try {
        const item = cart.find(i => i.id === id);
        if (!item) throw "Item not found";

        item.quantity++;
        saveCart();
        displayCart();

    } catch (error) {
        alert(error);
    }
}

function decrease(id) {
    try {
        const item = cart.find(i => i.id === id);
        if (!item) throw "Item not found";

        if (item.quantity > 1) {
            item.quantity--;
        } else {
            throw "Quantity cannot be less than 1";
        }

        saveCart();
        displayCart();

    } catch (error) {
        alert(error);
    }
}


// REMOVE ITEM

function removeItem(id) {
    try {
        cart = cart.filter(item => item.id !== id);
        saveCart();
        displayCart();
        updateCartCount();

    } catch (error) {
        alert(error);
    }
}


// CHECKOUT VALIDATION

const form = document.getElementById("checkout-form");

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        try {
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const address = document.getElementById("address").value.trim();

            if (!name || !email || !phone || !address) {
                throw "All fields are required!";
            }

            if (!email.includes("@")) {
                throw "Invalid email format!";
            }

            if (phone.length < 10 || isNaN(phone)) {
                throw "Invalid phone number!";
            }

            if (cart.length === 0) {
                throw "Cart is empty!";
            }

            alert("Order placed successfully!");

            localStorage.removeItem("cart");
            cart = [];

        } catch (error) {
            alert(error);
        }
    });
}


// INITIAL LOAD

displayProducts(products);
displayCart();
updateCartCount();