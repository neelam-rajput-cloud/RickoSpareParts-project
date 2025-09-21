const categoryContainer = document.getElementById("categoryContainer");

categories.forEach((cat) => {
  const card = document.createElement("a");
card.href = `products.html?category=${cat.id}`;

  card.innerHTML = `
      <div class="h-[300px] w-[210px] text-center hover:scale-105 transition duration-300">
        <img src="${cat.img}" alt="${cat.name}" class="h-[200px] w-[210px] border rounded-[16px] object-cover">
        <div class="text-black text-lg font-semibold text-center pt-8">${cat.name}</div>
      </div>
    `;

  categoryContainer.appendChild(card);
});
