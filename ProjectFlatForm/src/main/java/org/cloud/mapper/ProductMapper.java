package org.cloud.mapper;

import java.time.LocalDateTime;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.cloud.dto.ProductDTO;
import org.springframework.data.repository.query.Param;

@Mapper
public interface ProductMapper {

	List<ProductDTO> findProductsByFilters(
			@Param("keyword") String keyword,
			@Param("region") String region,
			@Param("startDate") LocalDateTime startDate,
			@Param("sort") String sort
			);
	
}
