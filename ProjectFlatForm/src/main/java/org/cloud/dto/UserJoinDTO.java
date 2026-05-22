package org.cloud.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserJoinDTO {

	private String name;
	
	@NotBlank
	@Pattern(regexp = "^[a-zA-Z0-9]*$", message = "아이디 형식이 올바르지 않습니다.")
	private String id;
	
	@NotBlank
	@Size(min = 8, message = "비밀번호는 최소 8자 이상이어야 합니다.")
	private String password;
	
	private String email;
	private String userRegion;
}
