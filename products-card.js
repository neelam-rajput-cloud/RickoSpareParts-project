const params = new URLSearchParams(window.location.search);
const categoryId = params.get("category");
const productsContainer = document.getElementById("products");
const categoryList = document.getElementById("category-list");
const bucketCount = document.getElementById("bucketCount");

const filterdProduct =
  categoryId !== ""
    ? products.filter((item) => item.category_id == categoryId)
    : products;

console.log(categoryId);
console.log(categories);

let selectedProduct = null;
let quantity = 1;

// ✅ Update bucket count
function updateBucketCount() {
  const bucket = JSON.parse(localStorage.getItem("bucket")) || [];
  const bucketQuantity = bucket.length;
  bucketCount.textContent = bucketQuantity;
}
updateBucketCount();

// ✅ Category list rendering
const isAllActive = !categoryId;
const liAll = document.createElement("li");
liAll.innerHTML = `
  <a href="products.html?category=" 
     class="category-link block px-4 py-2 rounded-lg transition
    ${isAllActive ? "bg-white text-black" : "hover:bg-white hover:text-black"}">
    All Products
  </a>
`;
categoryList.appendChild(liAll);

categories.forEach((cat) => {
  const isActive = categoryId == cat.id;
  const li = document.createElement("li");
  li.innerHTML = `
    <a href="products.html?category=${cat.id}" 
       class="category-link block px-4 py-2 rounded-lg transition
      ${isActive ? "bg-white text-black" : "hover:bg-white hover:text-black"}">
      ${cat.name}
    </a>
  `;
  categoryList.appendChild(li);
});

const searchBar = document.createElement("div");
searchBar.className = "mb-4 w-full";
searchBar.innerHTML = `
  <input 
    type="text" 
    id="searchInput" 
    placeholder="Search products..." 
    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-200"
  />
`;
productsContainer.parentNode.insertBefore(searchBar, productsContainer);

// ✅ Render Products function
function renderProducts(list) {
  productsContainer.innerHTML = ""; // clear previous products
  if (list.length === 0) {
    productsContainer.innerHTML =
      `<p class="text-gray-500 text-center col-span-full">No products found</p>`;
    return;
  }

  list.forEach((product) => {
    const card = document.createElement("div");
    card.className =
      "border rounded-lg shadow-lg p-4 text-center hover:scale-105 transition bg-white";
    card.innerHTML = `
      <img src="${product.img}" alt="${product.name}" class="h-[150px] w-full object-contain rounded-lg">
      <h3 class="mt-4 text-lg font-semibold">${product.name}</h3>
      <p class="text-gray-600">${product.desc}</p>
      <p class="text-green-600 font-bold mt-2">PKR ${product.price}</p>
      <button 
        class="details-btn mt-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        data-id="${product.id}">
        Details
      </button>
    `;
    productsContainer.appendChild(card);
  });
}

// Initial render
renderProducts(filterdProduct);

// ✅ Search filter
document.getElementById("searchInput").addEventListener("input", (e) => {
  const searchText = e.target.value.toLowerCase();
  const searched = filterdProduct.filter((p) =>
    p.name.toLowerCase().includes(searchText)
  );
  renderProducts(searched);
});

/* ------------------- MODAL LOGIC ------------------- */
const productModal = document.getElementById("productModal");
const closeModal = document.getElementById("closeModal");
const modalImage = document.getElementById("modalImage");
const modalName = document.getElementById("modalName");
const modalBrand = document.getElementById("modalBrand");
const modalPrice = document.getElementById("modalPrice");
const modalDescription = document.getElementById("modalDescription");
const quantityEl = document.getElementById("quantity");
const increaseQty = document.getElementById("increaseQty");
const decreaseQty = document.getElementById("decreaseQty");
const addToBucketBtn = document.getElementById("addToBucket");

// Open modal
document.addEventListener("click", (e) => {
  if (e.target.closest(".details-btn")) {
    const btn = e.target.closest(".details-btn");
    const productId = btn.dataset.id;

    selectedProduct = products.find((p) => p.id == productId);

    if (!selectedProduct) return;

    quantity = 1;
    quantityEl.textContent = quantity;

    modalImage.src = selectedProduct.img;
    modalName.textContent = selectedProduct.name;
    modalBrand.textContent = selectedProduct.brand || "Hico";
    modalPrice.textContent = `Rs. ${selectedProduct.price}`;
    modalDescription.textContent = selectedProduct.desc;

    productModal.classList.remove("hidden");
    productModal.classList.add("flex");
  }
});

closeModal.addEventListener("click", () => {
  productModal.classList.add("hidden");
  productModal.classList.remove("flex");
});

increaseQty.addEventListener("click", () => {
  quantity++;
  quantityEl.textContent = quantity;
});

decreaseQty.addEventListener("click", () => {
  if (quantity > 1) {
    quantity--;
    quantityEl.textContent = quantity;
  }
});

addToBucketBtn.addEventListener("click", () => {
  let bucket = JSON.parse(localStorage.getItem("bucket")) || [];

  const existingItem = bucket.find((item) => item.id === selectedProduct.id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    bucket.push({
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      img: selectedProduct.img,
      quantity: quantity,
    });
  }

  localStorage.setItem("bucket", JSON.stringify(bucket));
  updateBucketCount();

  productModal.classList.add("hidden");
  productModal.classList.remove("flex");
});
