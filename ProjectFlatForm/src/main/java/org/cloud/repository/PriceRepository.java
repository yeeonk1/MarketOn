package org.cloud.repository;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.cloud.domain.PriceHistory;
import org.cloud.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PriceRepository extends JpaRepository<PriceHistory, Long> {

	List<PriceHistory> findByProductId(Product product);

	List<PriceHistory> findByProductIdOrderByDateDesc(Product product);

	List<PriceHistory> findByProductIdOrderByDateAsc(Product product);

	Optional<PriceHistory> findTopByProductIdOrderByDateDesc(Product product);

	
	// 메인 화면 (인기 품목, 가격 하락순 TOP 3)
	@Query(value = "SELECT p.product_id AS productId, " +
            "p.item_name AS itemName, " +
            "p.category AS category, " +
            "MAX(ph.kind_name) AS kindName, " +
            "MAX(p.unit_sz) AS unitSz, " + 
            "MAX(ph.unit) AS unit, " +
            "MAX(ph.avg_price) AS avgPrice, " +
            "MAX(ph.change_rate) AS changeRate, " +
            "p.view_count AS viewCount, " +
            "MAX(ph.rank_name) AS rankName " +
            "FROM price_history ph " +
            "JOIN product p ON ph.product_id = p.product_id " +
            "WHERE ph.date = (SELECT MAX(date) FROM price_history) " +
            "AND TRIM(ph.region) = :region " +
            "GROUP BY p.product_id, p.item_name, p.category, p.view_count " // 💡 상품 중복 제거 격리
            + "ORDER BY p.view_count DESC LIMIT 3", nativeQuery = true)
	List<Map<String, Object>> findTop3PopularByRegion(@Param("region") String region);

	@Query(value = "SELECT p.product_id as productId, p.item_name as itemName, "
			+ "ph.avg_price as avgPrice, ph.change_rate as changeRate " + "FROM price_history ph "
			+ "JOIN product p ON ph.product_id = p.product_id "
			+ "WHERE ph.date = (SELECT MAX(date) FROM price_history) " + "AND TRIM(ph.region) = :region "
			+ "ORDER BY ph.change_rate ASC LIMIT 3", nativeQuery = true)
	List<Map<String, Object>> findTop3PriceDropByRegion(@Param("region") String region);
	
	// 전체 리스트 TOP 100
	@Query(value = "SELECT p.product_id AS productId, " +
            "p.item_name AS itemName, " +
            "p.category AS category, " +
            "MAX(ph.kind_name) AS kindName, " +
            "MAX(p.unit_sz) AS unitSz, " + 
            "MAX(ph.unit) AS unit, " +
            "MAX(ph.avg_price) AS avgPrice, " +
            "MAX(ph.change_rate) AS changeRate, " +
            "p.view_count AS viewCount, " +
            "MAX(ph.rank_name) AS rankName " +
            "FROM price_history ph " +
            "JOIN product p ON ph.product_id = p.product_id " +
            "WHERE ph.date = (SELECT MAX(date) FROM price_history) " +
            "AND TRIM(ph.region) = :region " +
            "GROUP BY p.product_id, p.item_name, p.category, p.view_count " // 💡 상품 중복 제거 격리
            + "ORDER BY p.view_count DESC LIMIT 100", nativeQuery = true)
	List<Map<String, Object>> findTop100PopularByRegion(@Param("region") String region);
	
	@Query(value = "SELECT p.product_id AS productId, " +
            "p.item_name AS itemName, " +
            "p.category AS category, " +
            "ph.kind_name AS kindName, " +
            "p.unit_sz AS unitSz, " +
            "ph.unit AS unit, " +
            "ph.avg_price AS avgPrice, " +
            "ph.change_rate AS changeRate, " +
            "ph.rank_name AS rankName, " +
            "p.view_count AS viewCount " +
            "FROM price_history ph " +
            "JOIN product p ON ph.product_id = p.product_id " +
            "WHERE ph.date = (SELECT MAX(date) FROM price_history) " +
            "AND TRIM(ph.region) = :region " +
            "ORDER BY ph.change_rate ASC LIMIT 100", nativeQuery = true)
	List<Map<String, Object>> findTop100PriceDropByRegion(@Param("region") String region);
	
	
	
	@Query(value = "SELECT p.product_id AS productId, " +
            "p.item_name AS itemName, " +
            "p.category AS category, " +
            "ph.kind_name AS kindName, " +
            "ph.trade_type_name AS rankName, " +
            "p.unit_sz AS unitSz, " +
            "ph.unit AS unit, " +
            "ph.avg_price AS avgPrice, " +
            "ph.min_price AS minPrice, " +
            "ph.max_price AS maxPrice, " +
            "ph.change_rate AS changeRate, " +
            "((ph.avg_price - ph.min_price) / ph.min_price) AS bargainScore " +
            "FROM price_history ph " +
            "JOIN product p ON ph.product_id = p.product_id " +
            "WHERE ph.region = :region " +
            "AND ph.min_price > 0 " +
            "AND ph.date = (SELECT MAX(date) FROM price_history WHERE region = :region) " +
            "ORDER BY bargainScore ASC " +
            "LIMIT 1", nativeQuery = true)
	Map<String, Object> findTopBargainProduct(@Param("region") String region); // 메인페이지 추천
	
	@Query(value = "SELECT p.product_id AS productId, " +
            "p.item_name AS itemName, " +
            "p.category AS category, " +
            "MAX(ph.kind_name) AS kindName, " +
            "MAX(p.unit_sz) AS unitSz, " + 
            "MAX(ph.unit) AS unit, " +
            "MAX(ph.avg_price) AS avgPrice, " +  
            "MAX(ph.min_price) AS minPrice, " +
            "MAX(ph.max_price) AS maxPrice, " +
            "MAX(ph.rank_name) AS rankName " +
            "FROM price_history ph " +
            "JOIN product p ON ph.product_id = p.product_id " +
            "WHERE ph.date = (SELECT MAX(date) FROM price_history) " +
            "AND TRIM(ph.region) = :region " +
            "AND ph.max_price > ph.min_price " + 
            "GROUP BY p.product_id, p.item_name, p.category " + 
            "ORDER BY (1.0 - (CAST(MAX(ph.avg_price) AS DOUBLE) / CAST(MAX(ph.max_price) AS DOUBLE))) DESC " + 
            "LIMIT 100", nativeQuery = true)
	List<Map<String, Object>> findBargainProductList(@Param("region") String region); // 가성비 순위 전체 조회
	
	// 분석
	@Query(value = "SELECT ph.date AS \"date\", " +
            "ph.avg_price AS \"avgPrice\", " +
            "ph.max_price AS \"maxPrice\", " +
            "ph.min_price AS \"minPrice\" " +
            "FROM price_history ph " +
            "JOIN product pr ON ph.product_id = pr.product_id " +
            "WHERE pr.item_name = :itemName " +
            "AND ph.region = :region " +
            "AND (pr.kind_name = :kindName OR (:kindName IS NULL AND pr.kind_name IS NULL)) " + // 품종 검증
            "AND ph.rank_name = :rankName " +
            "AND pr.unit_sz = :unitSz " +
            "AND ph.unit = :unit " +
            "AND ph.date BETWEEN :startDate AND :endDate " +
            "ORDER BY ph.date ASC", nativeQuery = true)
	List<Map<String, Object>> findDailyAnalysis(
			@Param("itemName") String itemName,
	        @Param("region") String region,
	        @Param("kindName") String kindName,
	        @Param("rankName") String rankName,
	        @Param("unitSz") String unitSz,
	        @Param("unit") String unit,
	        @Param("startDate") java.time.LocalDate startDate,
	        @Param("endDate") java.time.LocalDate endDate);
	
	@Query(value = "SELECT DISTINCT pr.kind_name AS \"kindName\", " +
            "ph.rank_name AS \"rankName\", " +
            "pr.unit_sz AS \"unitSz\", " +
            "ph.unit AS \"unit\" " +
            "FROM price_history ph " +
            "JOIN product pr ON ph.product_id = pr.product_id " +
            "WHERE pr.item_name = :itemName " +
            "AND pr.kind_name IS NOT NULL " +
            "ORDER BY pr.kind_name ASC, ph.rank_name ASC", nativeQuery = true)
	List<Map<String, Object>> findValidOptionsByItem(@Param("itemName") String itemName);
	
	@Query(value = """
		    SELECT
	        ph.product_id AS productId,
	        ph.avg_price AS avgPrice,
	        p.unit_sz AS unitSz,
	        ph.unit AS unit
	    FROM price_history ph
	    JOIN product p
	        ON p.product_id = ph.product_id
	    JOIN (
	        SELECT
	            product_id,
	            MAX(date) AS latestDate
	        FROM price_history
	        WHERE region = :region
	          AND product_id IN (:productIds)
	        GROUP BY product_id
	    ) latest
	        ON ph.product_id = latest.product_id
	       AND ph.date = latest.latestDate
	    WHERE ph.region = :region
	    """, nativeQuery = true)
		List<Map<String, Object>> findLatestPricesByRegion(
		        @Param("region") String region,
		        @Param("productIds") List<Long> productIds);
}
