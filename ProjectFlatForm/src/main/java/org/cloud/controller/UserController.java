package org.cloud.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.cloud.domain.User;
import org.cloud.dto.UserJoinDTO;
import org.cloud.dto.UserLoginDTO;
import org.cloud.service.ProductService;
import org.cloud.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;
	private final ProductService productService;
	
	@PostMapping("/join")
	public ResponseEntity<String> join(@RequestBody UserJoinDTO dto) {
		try {
			userService.join(dto);
			 return ResponseEntity.ok("회원가입 성공");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}
	
	@GetMapping("/checkId")
	public ResponseEntity<Boolean> checkId(@RequestParam(name = "id") String id) {
		System.out.println("중복 체크 요청 들어옴! 입력된 ID: " + id);
		boolean isDuplicate = userService.isIdDuplicate(id);
		System.out.println("중복 여부: " + isDuplicate);
		return ResponseEntity.ok(isDuplicate);
	}
	
	@GetMapping("/checkEmail")
	public ResponseEntity<Boolean> checkEmail(@RequestParam(name = "email") String email) {
		boolean isDuplicate = userService.isEmailDuplicate(email);
		System.out.println("중복 여부: " + isDuplicate);
		return ResponseEntity.ok(isDuplicate);
	}
	
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody UserLoginDTO userLoginDTO, HttpServletRequest req) {
		try {
			User user = userService.login(userLoginDTO.getId(), userLoginDTO.getPassword());
			
			HttpSession ses = req.getSession();
			ses.setAttribute("user", user);
			
			Map<String, String> res = new HashMap<String, String>();
			res.put("name", user.getName());
			res.put("userRegion", user.getUserRegion());
			res.put("message", user.getName() + "님, 환영합니다.");
			
			return ResponseEntity.ok(res);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
		}
	}
	
	// 회원 정보 조회
	@GetMapping("/mypage/{userIdx}")
    public ResponseEntity<Map<String, Object>> getMyPageData(@PathVariable("userIdx") Long userIdx) {
        User user = productService.getUserProfile(userIdx);
        List<Map<String, Object>> favorites = productService.getFavList(userIdx);

        Map<String, Object> response = new HashMap<>();
        
        // 비밀번호를 제외 정보 매핑 (보안 처리)
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("idx", user.getIdx());
        userInfo.put("id", user.getId());
        userInfo.put("name", user.getName());
        userInfo.put("userRegion", user.getUserRegion());
        userInfo.put("email", user.getEmail());
        userInfo.put("createdAt", user.getCreatedAt());

        response.put("userInfo", userInfo);
        response.put("favoriteItems", favorites);

        return ResponseEntity.ok(response);
    }
	
	// 회원 정보 수정
	@PutMapping("/mypage/{userIdx}/profile")
    public ResponseEntity<String> updateProfile(
            @PathVariable("userIdx") Long userIdx,
            @RequestBody ProfileUpdateRequest request) {
        
		productService.updateUserProfile(
				userIdx,
				request.getName(),
				request.getUserRegion(),
				request.getPassword(),
				request.getEmail());
        return ResponseEntity.ok("프로필 정보가 성공적으로 수정되었습니다.");
    }
	
	// 관심 품목 등록 및 해제
	@PostMapping("/mypage/{userIdx}/favorite/{productId}")
    public ResponseEntity<Map<String, Object>> toggleFavorite(
            @PathVariable("userIdx") Long userIdx,
            @PathVariable("productId") Long productId) {
        
        boolean isFavorite = productService.toggleFav(userIdx, productId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("isFavorite", isFavorite);
        result.put("message", isFavorite ? "관심 품목에 추가되었습니다." : "관심 품목에서 제외되었습니다.");
        
        return ResponseEntity.ok(result);
    }
	
	// 프로필 수정 전용 DTO
	@Data
    public static class ProfileUpdateRequest {
        private String name;
        private String userRegion;
        private String password;
        private String email;
    }
	
	// 찜 등록 유무 체크
	@GetMapping("/mypage/{userIdx}/favorite-check/{productId}")
	public ResponseEntity<Boolean> checkFavoriteStatus(
	        @PathVariable("userIdx") Long userIdx,
	        @PathVariable("productId") Long productId) {
	    
	    boolean isFavorite = productService.isFavorite(userIdx, productId);
	    
	    return ResponseEntity.ok(isFavorite);
	}
}
