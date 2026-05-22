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
public class PriceDTO {
	
	@JsonProperty("product_id")
	private Long productId;

	@JsonProperty("exmn_ymd")
    private String date;

    // 평균 가격 (핵심 데이터 ⭐)
    @JsonProperty("exmn_dd_avg_prc")
    private String avgPrice;

    @JsonProperty("exmn_dd_min_prc")
    private String minPrice;

    @JsonProperty("exmn_dd_max_prc")
    private String maxPrice;

    @JsonProperty("item_nm")
    private String itemName;

    @JsonProperty("vrty_nm")
    private String kindName;

    @JsonProperty("unit")
    private String unit;

    @JsonProperty("sgg_nm")
    private String region;
    
    @JsonProperty("sgg_cd")
    private String regionCode;
    
    @JsonProperty("grd_nm")
    private String rankName;
    
    @JsonProperty("grd_cd")
    private String rankCode;
    
    // 추가
    @JsonProperty("ctgry_cd")
	private String categoryCode;
	
	@JsonProperty("item_cd")
	private String itemCode;
	
	@JsonProperty("vrty_cd")
	private String kindCode;
	
	@JsonProperty("ctgry_nm")
	private String category;
	
	@JsonProperty("unit_sz")
	private String unitSz;
	
	@JsonProperty("change_rate")
	private double changeRate;
}
