package org.cloud.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long idx;
	
	@Column(nullable = false, unique = true)
	private String id;
	
	@Column(nullable = false)
	private String password;
	
	@Column(nullable = false, length = 20)
	private String name;
	
	@Column(nullable = true, unique = true)
	private String email;
	
	@Column(nullable = true)
	private String userRegion;
	
	@Column(name = "created_at", updatable = false, insertable = false)
	private LocalDateTime createdAt;
}
