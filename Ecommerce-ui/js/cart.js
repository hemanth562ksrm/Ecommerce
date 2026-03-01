const cartContainer = document.getElementById("cart-items");
let cart = JSON.parse(localStorage.getItem("cart")) || [];

if (cartContainer) {
    cart.forEach(id => {
        const product = products.find(p => p.id === id);
        cartContainer.innerHTML += `
            <div class="card">
                <h3>${product.name}</h3>
                <p>₹${product.price}</p>
            </div>
        `;
    });
}
