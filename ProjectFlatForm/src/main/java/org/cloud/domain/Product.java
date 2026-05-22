package org.cloud.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long productId;
	
	@Column(nullable = false, length = 20)
	private String unitSz;
	
	@Column(nullable = false, length = 20)
	private String itemCode;
	
	@Column(length = 20)
	private String kindCode;
	
	@Column(nullable = false, length = 20)
	private String categoryCode;
	
	@Column(nullable = false, length = 50)
	private String itemName;
	
	@Column(length = 50)
	private String kindName;
	
	@Column(nullable = false, length = 20)
	private String category;
	
	@Column(name = "view_count")
	private Long viewCount = 0L;
}
