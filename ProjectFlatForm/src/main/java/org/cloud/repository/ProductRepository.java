package org.cloud.repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.cloud.domain.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

	Optional<Product> findByItemNameAndKindName(String itemName, String kindName);
	Page<Product> findByItemNameContaining(String itemName, Pageable pageable);
	
	// 조회수 증가
	@Modifying
	@Transactional
	@Query("UPDATE Product p SET p.viewCount = p.viewCount + 1 WHERE p.productId = :productId")
	void incrementViewCount(@Param("productId") Long productId);
	
	Page<Product> findByItemNameContainingOrKindNameContainingOrCategoryContaining(
			String itemNameKeyword,
			String kindNamekeyword,
			String categoryKeyword,
			Pageable pageable);
	
	// 상세 페이지
	@Query(value = "SELECT " +
            "ph.avg_price AS avgPrice, " +
            "ph.min_price AS minPrice, " +
            "ph.max_price AS maxPrice, " +
            "ph.unit AS unit, " +
            "ph.rank_name AS rankName, " +
            "p.unit_sz AS unitSz " +
            "FROM price_history ph " +
            "JOIN product p ON ph.product_id = p.product_id " +
            "WHERE p.product_id = :productId " +
            "AND TRIM(ph.region) = :region " +
            "ORDER BY ph.date DESC", nativeQuery = true) // 💡 최신 날짜 데이터가 무조건 0번째 인덱스(get(0))로 오도록 정렬
    List<Map<String, Object>> findAllByNameAndRegion(@Param("region") String region, @Param("productId") Long productId);
}