const container = document.getElementById("cart-items");

if (container) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    container.innerHTML = "";

    cart.forEach(id => {
        const product = products.find(p => p.id === id);
        if (product) {
            container.innerHTML += `
                <div class="card">
                    <h3>${product.name}</h3>
                    <p>₹${product.price}</p>
                </div>
            `;
        }
    });
}
