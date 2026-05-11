package com.example.demo.repository;

import com.example.demo.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> { 
	// 從資料庫撈出所有不重複的系列名稱（排除空值）
    @Query("SELECT DISTINCT p.series FROM Product p WHERE p.series IS NOT NULL AND p.series <> '' ORDER BY p.series")
    List<String> findDistinctSeries();
}
