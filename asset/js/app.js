const API_URL = 'https://dummyjson.com/products';
const productGrid = document.getElementById('productGrid');
const productModal = new bootstrap.Modal(document.getElementById('productModal'));

document.addEventListener('DOMContentLoaded', loadProducts);

async function loadProducts() {
    productGrid.innerHTML = ''; 
    
    try {
        const response = await fetch(`${API_URL}?limit=15`);
        const data = await response.json();
          
        data.products.forEach(product => showProductInUI(product));
        
    } catch (error) {
        alert("Data load not");

    } finally {
        setTimeout(() => {
            loader.style.display = 'none';
        }, 2000);
    }
}

function showProductInUI(product) {
    const col = document.createElement('div');
    col.className = 'col-md-4 col-lg-3 mb-4';
    col.id = `product-${product.id}`; 
    
    col.innerHTML = `
        <div class="card h-100 shadow-sm">
            <img src="${product.thumbnail}" class="card-img-top" style="height: 200px; object-fit: cover;">
            <div class="card-body">
                <span class="badge bg-secondary">${product.category}</span>
                <h5 class="card-title mt-2">${product.title}</h5>
                <p class="card-text fw-bold text-primary">$${product.price}</p>
                
                <div class="d-flex gap-2 mt-3">
                    <button class="btn btn-warning btn-sm w-100" onclick="editProduct(${product.id})">Edit</button>
                    <button class="btn btn-danger btn-sm w-100" onclick="deleteProduct(${product.id})">Delete</button>
                </div>
            </div>
        </div>
    `;
    productGrid.prepend(col); 
}


window.editProduct = async (id) => {

    const response = await fetch(`${API_URL}/${id}`);
    const product = await response.json();

    document.getElementById('productId').value = product.id;
    document.getElementById('title').value = product.title;
    document.getElementById('price').value = product.price;
    document.getElementById('category').value = product.category;

    document.getElementById('modalTitle').innerText = 'Edit Product';
    productModal.show();
};


window.deleteProduct = async (id) => {
    if (confirm("Are you sure?")) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        
            document.getElementById(`product-${id}`).remove();
            alert("Deleted successfully!");
            
        } catch (error) {
            alert("Delete not do");
        }
    }
};

