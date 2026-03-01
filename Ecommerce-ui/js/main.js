function displayProducts(category) {
    const container = document.getElementById("products");
    if (!container) return;

    container.innerHTML = "";

    const filtered = category 
        ? products.filter(p => p.category === category)
        : products;

    filtered.forEach(product => {
        container.innerHTML += `
            <div class="card">
                <h3>${product.name}</h3>
                <p>₹${product.price}</p>
                <button onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        `;
    });
}

function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(id);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to Cart");
}
