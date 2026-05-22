package org.cloud.domain;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PriceHistory {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long priceId;
	
	@Column(nullable = false)
	private LocalDate date;
	
	@Column(length = 20)
	private String tradeTypeCode;
	
	@Column(length = 50)
	private String tradeTypeName;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "product_id")
	private Product productId;
	
	@Column(nullable = false, length = 20)
	private Integer avgPrice;
	
	@Column(nullable = false, length = 20)
	private Integer minPrice;
	
	@Column(nullable = false, length = 20)
	private Integer maxPrice;
	
	@Column(nullable = true, length = 50)
	private String kindName;
	
	@Column(nullable = false, length = 50)
	private String region;
	
	@Column(nullable = false, length = 20)
	private String regionCode;
	
	@Column(nullable = false, length = 20)
	private String rankCode;
	
	@Column(nullable = false, length = 50)
	private String rankName;
	
	@Column(nullable = false, length = 20)
	private String unit;
	
	@Column(nullable = true, length = 10, name = "change_rate")
	private Double changeRate;
}
