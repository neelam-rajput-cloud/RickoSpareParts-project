const productsContainer = document.getElementById("products");
const categoryList = document.getElementById("category-list");
const bucketCount = document.getElementById("bucketCount");

let selectedProduct = null;
let quantity = 1;

function updateBucketCount() {
  const bucket = JSON.parse(localStorage.getItem("bucket")) || [];
  bucketCount.textContent = bucket.reduce(
    (total, item) => total + item.quantity,
    0
  );
}
updateBucketCount();

data.categories.forEach((cat, catIndex) => {
  const li = document.createElement("li");
  li.innerHTML = `
    <a href="#category-${cat.id}" 
      class="category-link block px-4 py-2 rounded-lg hover:bg-white hover:text-black transition">
      ${cat.name}
    </a>
  `;
  categoryList.appendChild(li);

  const section = document.createElement("div");
  section.id = `category-${cat.id}`;
  section.innerHTML = `
    <h2 class="text-3xl font-bold mb-4">${cat.name}</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="cat-${cat.id}-products"></div>
  `;
  productsContainer.appendChild(section);

  const productsDiv = document.getElementById(`cat-${cat.id}-products`);

  cat.products.forEach((product, index) => {
    const card = document.createElement("div");
    card.className =
      "border rounded-lg shadow-lg p-4 text-center hover:scale-105 transition";
    card.innerHTML = `
      <img src="${product.img}" alt="${product.name}" class="h-[150px] w-full object-cover rounded-lg">
      <h3 class="mt-4 text-lg font-semibold">${product.name}</h3>
      <p class="text-gray-600">${product.desc}</p>
      <p class="text-green-600 font-bold mt-2">PKR ${product.price}</p>
      <button 
        class="details-btn mt-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        data-cat="${catIndex}" data-index="${index}">
        Details
      </button>
    `;
    productsDiv.appendChild(card);
  });
});

// Modal references
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
    const catIndex = btn.dataset.cat;
    const productIndex = btn.dataset.index;

    selectedProduct = data.categories[catIndex].products[productIndex];

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
