$(document).ready(function(){

  let allProducts = [];

  // 從資料庫撈商品
  fetch("http://localhost:8080/api/products")
    .then(r => r.json())
    .then(products => {
      allProducts = products;
      renderProduct(products[0]);
    });

  function renderProduct(product) {
    $("#productName").text(product.name);
    $("#productSeries").text((product.series || "") + " · " + (product.color || ""));
    $("#productPrice").text("NT$ " + Number(product.price).toLocaleString());
    $("#mainImage").attr("src", "/" + product.image);

    $(".thumb").removeClass("active");
    $(`.thumb[data-src="${product.image}"]`).addClass("active");

    $(".add-cart")
      .attr("data-id", product.id)
      .attr("data-name", product.name)
      .attr("data-color", product.color)
      .attr("data-price", product.price)
      .attr("data-image", product.image);
  }

  // 顏色選單切換
  $("#colorSelect").change(function() {
    const id = parseInt($(this).val());
    const product = allProducts.find(p => p.id === id);
    if (product) renderProduct(product);
  });

  // 縮圖點擊切換主圖
  $(".thumbnails").on("click", ".thumb", function() {
    const newSrc = $(this).data("src");
    $("#mainImage").attr("src", newSrc);
    $(".thumb").removeClass("active");
    $(this).addClass("active");
  });

  // 數量控制
  $("#plus").click(function() {
    $("#qty").val(parseInt($("#qty").val()) + 1);
  });

  $("#minus").click(function() {
    let qty = parseInt($("#qty").val());
    if (qty > 1) $("#qty").val(qty - 1);
  });

});