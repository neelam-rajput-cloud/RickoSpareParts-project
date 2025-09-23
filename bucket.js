function renderBucket() {
  const bucket = JSON.parse(localStorage.getItem("bucket")) || [];
  const container = document.getElementById("bucket-items");
  const totalPriceEl = document.getElementById("total-price");

  container.innerHTML = "";
  let total = 0;

  if (bucket.length === 0) {
    container.innerHTML = `<p class="text-gray-500 text-center">🛒 Your bucket is empty</p>`;
    totalPriceEl.textContent = "0";
    return;
  }

  bucket.forEach((item, index) => {
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.className = "border-b pb-2 last:border-0 py-3";

    div.innerHTML = `
      <div class="flex items-center gap-3">
        <img src="${item.img}" alt="${item.name}" class="w-14 h-14 rounded border object-cover" />
        <div>
          <p class="font-semibold text-gray-800">${item.name}</p>
          <p class="text-gray-600 text-sm">Rs.${item.price}</p>
        </div>
      </div>

      <div class="flex justify-end items-center gap-2 mt-2">
        <button 
          class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onclick="changeQty(${index}, 'increase')">+</button>
        <span class="px-3 font-semibold text-center w-8">${item.quantity}</span>
        <button 
          class="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          onclick="changeQty(${index}, 'decrease')">-</button>
        <button 
          class="text-red-500 hover:text-red-700 text-xl ml-2"
          onclick="deleteItem(${index})"><img src="svg/trash.svg" alt="trash" class="w-8 h-8"></button>
      </div>
    `;
    container.appendChild(div);
  });

  totalPriceEl.textContent = total;
}

// --- Quantity Update (won't go below 1) ---
function changeQty(index, action) {
  const bucket = JSON.parse(localStorage.getItem("bucket")) || [];
  if (!bucket[index]) return;

  if (action === "increase") {
    bucket[index].quantity += 1;
  } else if (action === "decrease") {
    if (bucket[index].quantity > 1) {
      bucket[index].quantity -= 1;
    }
  }

  localStorage.setItem("bucket", JSON.stringify(bucket));
  renderBucket();
  updateBucketCount();
}

// --- Delete Item ---
function deleteItem(index) {
  const bucket = JSON.parse(localStorage.getItem("bucket")) || [];
  if (!bucket[index]) return;
  bucket.splice(index, 1);
  localStorage.setItem("bucket", JSON.stringify(bucket));
  renderBucket();
  updateBucketCount();
}

// --- Update Count Badge ---
function updateBucketCount() {
  const bucket = JSON.parse(localStorage.getItem("bucket")) || [];
  const totalQty = bucket.reduce((sum, item) => sum + item.quantity, 0);
  const el = document.getElementById("bucketCount");
  if (el) el.textContent = totalQty;
}

// --- Modal Controls ---
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
  });

  bucketModal.addEventListener("click", (e) => {
    if (e.target === bucketModal) {
      bucketModal.classList.add("hidden");
    }
  });

  renderBucket();
  updateBucketCount();
});
