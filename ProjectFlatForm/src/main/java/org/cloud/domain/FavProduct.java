package org.cloud.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table
@Data
public class FavProduct {

	@Id
	@GeneratedValue
	@Column(name = "favorite_id")
	private Long favoriteId;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_idx", nullable = false)
	private User user;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "product_id", nullable = false)
	private Product product;
	
	@Column(name = "created_at", updatable = false)
	private LocalDateTime createdAt = LocalDateTime.now();
}
