package org.cloud.repository;

import java.util.Optional;

import org.cloud.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	
	boolean existsById(String id);
	boolean existsByEmail(String email);
	Optional<User> findById(String id);
}
