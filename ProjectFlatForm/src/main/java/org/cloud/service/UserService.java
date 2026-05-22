package org.cloud.service;

import org.cloud.domain.User;
import org.cloud.dto.UserJoinDTO;
import org.cloud.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;
	private final BCryptPasswordEncoder passwordEncoder;
	
	// 회원가입
	public void join(UserJoinDTO dto) {
		if (userRepository.existsById(dto.getId())) {
			throw new IllegalStateException("이미 존재하는 아이디입니다.");
		}
		
		String encodedPwd = passwordEncoder.encode(dto.getPassword());
		
		User user = User.builder()
				.id(dto.getId())
				.password(encodedPwd)
				.name(dto.getName())
				.email(dto.getEmail())
				.userRegion(dto.getUserRegion())
				.build();
		
		userRepository.save(user);
	}
	
	public boolean isIdDuplicate(String id) {
		return userRepository.existsById(id);
	}
	
	public boolean isEmailDuplicate(String email) {
		return userRepository.existsByEmail(email);
	}
	
	// 로그인
	public User login(String id, String password) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 아이디입니다."));
		
		if (!passwordEncoder.matches(password, user.getPassword())) {
			throw new IllegalArgumentException("아이디 또는 비밀번호가 일치하지 않습니다.");
		}
		
		return user;
	}
}
