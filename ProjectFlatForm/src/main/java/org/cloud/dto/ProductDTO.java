package org.cloud.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductDTO {
	
	@JsonProperty("product_id")
	private Long productId;
	
	@JsonProperty("ctgry_cd")
	private String categoryCode;
	
	@JsonProperty("item_cd")
	private String itemCode;
	
	@JsonProperty("vrty_cd")
	private String kindCode;
	
	@JsonProperty("ctgry_nm")
	private String category;
	
	@JsonProperty("vrty_nm")
	private String kindName;
	
	@JsonProperty("item_nm")
	private String itemName;
	
	@JsonProperty("unit_sz")
	private String unitSz;
	
	@JsonProperty("viewCount")
	private Long viewCount;
}
