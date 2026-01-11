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

document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const id = document.getElementById('productId').value;
    const productData = {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        category: document.getElementById('category').value
    };

    try {
        if (id) {
 
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            const updatedProduct = await response.json();

   
            updateCardUI(id, updatedProduct);
            alert("Product updated successfully!");

        } else {
   
            const response = await fetch(`${API_URL}/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            const newProduct = await response.json();
            

            newProduct.thumbnail = 'https://via.placeholder.com/300';
            
            showProductInUI(newProduct); 
            alert("New product added!");
        }
        
        productModal.hide(); 
        document.getElementById('productForm').reset(); 

    } catch (error) {
        console.error("Error:", error);
    }
});


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


window.openAddModal = () => {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = ''; 
    document.getElementById('modalTitle').innerText = 'Add New Product';
    productModal.show();
};


function updateCardUI(id, data) {
    const card = document.getElementById(`product-${id}`);
    if (card) {
        card.querySelector('.card-title').innerText = data.title;
        card.querySelector('.card-text').innerText = `$${data.price}`;
        card.querySelector('.badge').innerText = data.category;
    }
}