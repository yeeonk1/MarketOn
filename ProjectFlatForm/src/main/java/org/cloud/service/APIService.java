package org.cloud.service;

import java.net.URI;
import java.util.List;

import org.cloud.dto.ApiResponseDTO;
import org.cloud.dto.PriceDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class APIService {

	private final RestTemplate restTemplate;
	private final PriceService priceService;

	@Value("${data.api.key}")
	private String serviceKey;

	private static final String BASE_URL = "https://apis.data.go.kr/B552845/perRegion/price";

	public void fetchAndSave() {
		
		List<String> sggCodes = List.of(
			    "1101", "2100", "2200", "2300", "2401", "2501", "2601", "2701", 
			    "3100", "3111", "3112", "3113", "3138", "3145", "3201", "3211", 
			    "3214", "3300", "3311", "3312", "3400", "3411", "3500", "3511", 
			    "3512", "3600", "3611", "3613", "3700", "3711", "3714", "3800", 
			    "3811", "3814", "3818", "3911", "9998", "1000"
			);
		
		for (String sggCode : sggCodes) {
			System.out.println("현재 지역 코드: " + sggCode);
			
			int pageNo = 1;
			boolean hasMoreData = true;
			
			while (hasMoreData) {
				String url = BASE_URL
				    + "?serviceKey=" + serviceKey
				    + "&returnType=json"
				    + "&pageNo=" + pageNo
				    + "&numOfRows=1000"
				    + "&cond%5Bsgg_cd::EQ%5D=" + sggCode
				    + "&cond%5Bexmn_ymd::GTE%5D=20260501"
				    + "&cond%5Bexmn_ymd::LTE%5D=20260515";
				
				try {
					System.out.println(pageNo + "페이지 요청 중...");
					URI uri = URI.create(url);

					ResponseEntity<ApiResponseDTO> response = restTemplate.getForEntity(uri, ApiResponseDTO.class);

					System.out.println("응답 상태: " + response.getStatusCode());
					System.out.println("응답 바디: " + response.getBody());
					
					List<PriceDTO> items = null;
					if (response.getBody() != null
							&& response.getBody().getResponse() != null
							&& response.getBody().getResponse().getBody() != null) {
						items = response.getBody().getResponse().getBody().getItems().getItem();	
					}
					
					// 추가
					if (response.getBody() != null && response.getBody().getResponse() != null) {
					    var body = response.getBody().getResponse().getBody();
					    if (body != null && body.getItems() != null) {
					        items = body.getItems().getItem();
					    } else {
					        System.out.println("⚠️ API 응답의 Body나 Items가 null입니다!");
					    }
					}
					
					if (items == null || items.isEmpty()) {
					    System.out.println("❓ items가 비어있습니다. 응답 원본을 확인하세요.");
					    // 이 아래 코드를 추가해서 실제 JSON 구조를 눈으로 보세요.
					    ResponseEntity<String> rawJson = restTemplate.getForEntity(uri, String.class);
					    System.out.println("🔎 RAW JSON: " + rawJson.getBody());
					    
					    hasMoreData = false;
					}
					
					if (items != null && !items.isEmpty()) {
						priceService.savePrices(items);
						System.out.println(pageNo + "페이지 저장 성공");
						
						if (items.size() < 1000) {
							hasMoreData = false;
							System.out.println("마지막 페이지입니다.");
						} else {
							pageNo++;
						}
					} else {
						System.out.println("더 이상 가져올 데이터를 찾지 못하였습니다.");
						hasMoreData = false;
					}
					
					Thread.sleep(500);
					
				} catch (Exception e) {
					System.err.println("에러 발생" + e.getMessage());
					hasMoreData = false;
				}
			}
		}
		
		System.out.println("전체 데이터 수집 완료");
	}
}
