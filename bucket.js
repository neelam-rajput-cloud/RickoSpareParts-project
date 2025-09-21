document.addEventListener("DOMContentLoaded", () => {
  const bucketBtn = document.getElementById("bucketBtn");
  const bucketModal = document.getElementById("bucketModal");
  const closeBucket = document.getElementById("closeBucket");

  bucketBtn.addEventListener("click", () => {
    renderBucket();
    bucketModal.classList.remove("hidden");
    bucketModal.classList.add("flex");
  });

  closeBucket.addEventListener("click", () => {
    bucketModal.classList.add("hidden");
    bucketModal.classList.remove("flex");
  });

  bucketModal.addEventListener("click", (e) => {
    if (e.target === bucketModal) {
      bucketModal.classList.add("hidden");
      bucketModal.classList.remove("flex");
    }
  });

  // Add to bucket globally
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-btn")) {
      const productId = parseInt(e.target.dataset.id);

      // Search product in normalized data
      let product = data.products.find((p) => p.id === productId);
      if (!product) return;

      let bucket = JSON.parse(localStorage.getItem("bucket")) || [];

      const existingItem = bucket.find((item) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        bucket.push({
          id: product.id,
          name: product.name,
          price: product.price,
          img: product.img,
          quantity: 1,
        });
      }

      localStorage.setItem("bucket", JSON.stringify(bucket));
      updateBucketCount();
      renderBucket();
    }
  });

  renderBucket();
  updateBucketCount();
});

// Render bucket
function renderBucket() {
  const bucket = JSON.parse(localStorage.getItem("bucket")) || [];
  const container = document.getElementById("bucket-items");
  const totalPriceEl = document.getElementById("total-price");

  container.innerHTML = "";
  let total = 0;

  if (bucket.length === 0) {
    container.innerHTML = `<p class="text-gray-400 text-center">Your bucket is empty</p>`;
    totalPriceEl.textContent = "0";
    return;
  }

  bucket.forEach((item, index) => {
    total += item.price * item.quantity;

    container.innerHTML += `
      <div class="  border-b p-2  flex justify-between items-center w-full mx-auto mb-2 last:border-b-0">
        <div>
          <h2 class="text-lg text-gray-600 font-semibold">${item.name}</h2>
          <p class="text-black">Rs. ${item.price} × ${item.quantity}</p>
        </div>
        <div class="flex gap-2">
          <button class="px-2 py-1 bg-green-500 rounded text-white" onclick="changeQty(${index}, 'increase')">+</button>
          <button class="px-2 py-1 bg-red-500 rounded text-white" onclick="changeQty(${index}, 'decrease')">-</button>
          <button class="px-2 py-1 bg-gray-700 rounded text-white" onclick="deleteItem(${index})">Delete</button>
        </div>
      </div>
    `;
  });

  totalPriceEl.textContent = total;
}

// Change quantity
function changeQty(index, action) {
  const bucket = JSON.parse(localStorage.getItem("bucket")) || [];
  if (action === "increase") {
    bucket[index].quantity++;
  } else {
    bucket[index].quantity--;
    if (bucket[index].quantity <= 0) {
      bucket.splice(index, 1);
    }
  }
  localStorage.setItem("bucket", JSON.stringify(bucket));
  renderBucket();
  updateBucketCount();
}

// Delete item
function deleteItem(index) {
  const bucket = JSON.parse(localStorage.getItem("bucket")) || [];
  bucket.splice(index, 1);
  localStorage.setItem("bucket", JSON.stringify(bucket));
  renderBucket();
  updateBucketCount();
}

// Update bucket count (sum of quantities)
function updateBucketCount() {
  const bucket = JSON.parse(localStorage.getItem("bucket")) || [];
  const totalQty = bucket.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("bucketCount").textContent = totalQty;
}
