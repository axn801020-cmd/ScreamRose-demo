package com.example.demo.controller;

import com.example.demo.model.Product;
import com.example.demo.model.ProductImage;
import com.example.demo.repository.ProductImageRepository;
import com.example.demo.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.util.List;
import java.util.Map;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    @Autowired
    private Cloudinary cloudinary;

    @Value("${app.upload-dir:C:/screamrose-uploads/}")
    private String uploadDir;

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getProducts() {
        return ResponseEntity.ok(productRepository.findAll());
    }

 // 取得所有不重複的系列名稱（供前端下拉選單使用）
    @GetMapping("/products/series")
    public ResponseEntity<List<String>> getDistinctSeries() {
        return ResponseEntity.ok(productRepository.findDistinctSeries());
    }
    
    @PostMapping("/admin/products")
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        Product saved = productRepository.save(product); // 儲存後拿到含 ID 的物件
        // 同時回傳 ID 和訊息，讓前端知道新商品的 ID
        return ResponseEntity.ok(Map.of("id", saved.getId(), "message", "商品新增成功"));
    }

    @PutMapping("/admin/products/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        product.setId(id);
        productRepository.save(product);
        return ResponseEntity.ok("商品更新成功");
    }

    @DeleteMapping("/admin/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
        return ResponseEntity.ok("商品刪除成功");
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<?> getProduct(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/products/{id}/images")
    public ResponseEntity<?> getProductImages(@PathVariable Long id) {
        List<ProductImage> images = productImageRepository
                .findByProductIdOrderBySortOrderAsc(id);
        return ResponseEntity.ok(images);
    }

    @PostMapping("/products/{id}/images")
    public ResponseEntity<?> addProductImage(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("找不到商品"));
        ProductImage img = new ProductImage();
        img.setProduct(product);
        img.setImageUrl((String) body.get("imageUrl"));
        img.setSortOrder((Integer) body.getOrDefault("sortOrder", 0));
        productImageRepository.save(img);
        return ResponseEntity.ok(Map.of("message", "新增成功"));
    }

    @DeleteMapping("/images/{imageId}")
    public ResponseEntity<?> deleteProductImage(@PathVariable Long imageId) {
        productImageRepository.deleteById(imageId);
        return ResponseEntity.ok(Map.of("message", "刪除成功"));
    }

    @PostMapping("/admin/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap("resource_type", "image")
            );
            String imageUrl = (String) uploadResult.get("secure_url");
            return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "上傳失敗: " + e.getMessage()));
        }
    }
 // 音檔上傳（支援 mp3、wav）
    @PostMapping("/admin/upload-audio")
    public ResponseEntity<?> uploadAudio(@RequestParam("file") MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap("resource_type", "video") // 音檔用 video 類型
            );
            String audioUrl = (String) uploadResult.get("secure_url");
            return ResponseEntity.ok(Map.of("audioUrl", audioUrl));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "音檔上傳失敗: " + e.getMessage()));
        }
    }
}