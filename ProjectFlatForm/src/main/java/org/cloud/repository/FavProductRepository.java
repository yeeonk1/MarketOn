package org.cloud.repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.cloud.domain.FavProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FavProductRepository extends JpaRepository<FavProduct, Long> {

	Optional<FavProduct> findByUserIdxAndProductProductId(Long userIdx, Long productId);
	
	@Query(value = "SELECT p.product_id AS \"productId\", " +
            "p.item_name AS \"itemName\", " +
            "p.category AS \"category\" " +
            "FROM fav_product fp " +
            "JOIN product p ON fp.product_id = p.product_id " +
            "WHERE fp.user_idx = :userIdx " +
            "ORDER BY fp.created_at DESC", nativeQuery = true)
	List<Map<String, Object>> findFavProductsByUserIdx(@Param("userIdx") Long userIdx);
}
