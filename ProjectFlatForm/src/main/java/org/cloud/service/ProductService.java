package org.cloud.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.cloud.domain.FavProduct;
import org.cloud.domain.Product;
import org.cloud.domain.User;
import org.cloud.repository.FavProductRepository;
import org.cloud.repository.PriceRepository;
import org.cloud.repository.ProductRepository;
import org.cloud.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

	private final ProductRepository productRepository;
	private final PriceRepository priceRepository;
	private final FavProductRepository favProductRepository;
	private final UserRepository userRepository;

	// 검색
	public List<Map<String, Object>> searchProducts(String keyword, String region) {
		String targetRegion = (region == null || region.isEmpty()) ? "서울" : region;
		Pageable pageable = PageRequest.of(0, 20, Sort.by("viewCount").descending());
		Page<Product> productPage = productRepository
				.findByItemNameContainingOrKindNameContainingOrCategoryContaining(keyword, keyword, keyword, pageable);

		List<Product> products = productPage.getContent();
		List<Long> productIds = products.stream().map(Product::getProductId).toList();

		if (productIds.isEmpty()) {
			return List.of();
		}

		List<Map<String, Object>> priceList = priceRepository.findLatestPricesByRegion(targetRegion, productIds);
		Map<Long, Map<String, Object>> priceMap = priceList.stream().collect(Collectors
				.toMap(p -> ((Number) p.get("productId")).longValue(), p -> p, (existing, replacement) -> existing));

		return products.stream().map(product -> {

			Map<String, Object> map = new HashMap<>();
			map.put("productId", product.getProductId());
			map.put("itemName", product.getItemName());
			map.put("kindName", product.getKindName());
			map.put("category", product.getCategory());

			Map<String, Object> price = priceMap.get(product.getProductId());

			if (price != null) {
				map.put("avgPrice", price.get("avgPrice"));
				map.put("unitSz", price.get("unitSz"));
				map.put("unit", price.get("unit"));
			} else {
				map.put("avgPrice", null);
				map.put("unitSz", "-");
				map.put("unit", "");
			}
			return map;
		}).toList();
	}

	// 메인 페이지 리스트 TOP 3
	public List<Map<String, Object>> getMainPopular(String region) {
		String targetRegion = (region == null || region.isEmpty()) ? "서울" : region;
		return priceRepository.findTop3PopularByRegion(targetRegion);
	}

	public List<Map<String, Object>> getMainDrop(String region) {
		String targetRegion = (region == null || region.isEmpty()) ? "서울" : region;
		return priceRepository.findTop3PriceDropByRegion(targetRegion);
	}

	// 자세히 보기 전체 리스트 TOP 100
	public List<Map<String, Object>> getAllPopular(String region) {
		String targetRegion = (region == null || region.isEmpty()) ? "서울" : region;
		return priceRepository.findTop100PopularByRegion(targetRegion);
	}

	public List<Map<String, Object>> getAllDrop(String region) {
		String targetRegion = (region == null || region.isEmpty()) ? "서울" : region;
		return priceRepository.findTop100PriceDropByRegion(targetRegion);
	}

	

	// 메인페이지 1등 추천 상품
	public Map<String, Object> getMainTopBargain(String region) {
		String targetRegion = (region == null || region.isEmpty()) ? "서울" : region;
		return priceRepository.findTopBargainProduct(targetRegion);
	}

	// 가성비 추천 리스트 페이지
	public List<Map<String, Object>> getBargainList(String region) {
		String targetBargain = (region == null || region.isEmpty()) ? "서울" : region;
		return priceRepository.findBargainProductList(targetBargain);
	}

	// 유저 프로필 조회
	public User getUserProfile(Long userIdx) {
		return userRepository.findById(userIdx).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
	}

	// 프로필 수정
	@Transactional
	public User updateUserProfile(Long userIdx, String newName, String newRegion, String newPwd, String newEmail) {
		User user = userRepository.findById(userIdx).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

		user.setName(newName);
		user.setUserRegion(newRegion);
		user.setEmail(newEmail);
		user.setPassword(newPwd);
		return user;
	}

	// 관심 품목 리스트
	public List<Map<String, Object>> getFavList(Long userIdx) {
		return favProductRepository.findFavProductsByUserIdx(userIdx);
	}

	// 관심 품목 토글
	public boolean toggleFav(Long userIdx, Long productId) {
		User user = userRepository.findById(userIdx).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다."));

		Optional<FavProduct> existingFav = favProductRepository.findByUserIdxAndProductProductId(userIdx, productId);

		if (existingFav.isPresent()) {
			favProductRepository.delete(existingFav.get());
			return false;
		} else {
			FavProduct fav = new FavProduct();
			fav.setUser(user);
			fav.setProduct(product);
			favProductRepository.save(fav);
			return true;
		}
	}

	// 토글 유무 파악
	public boolean isFavorite(Long userIdx, Long productId) {
		return favProductRepository.findByUserIdxAndProductProductId(userIdx, productId).isPresent();
	}

	// 분석
	public List<Map<String, Object>> getDailyPriceAnalysis(String itemName, String region, int period, String kindName,
			String rankName, String unitSz, String unit) {
		LocalDate endDate = LocalDate.now();
		LocalDate startDate = endDate.minusDays(period);

		return priceRepository.findDailyAnalysis(itemName, region, kindName, rankName, unitSz, unit, startDate,
				endDate);
	}

	// 옵션 정제 분석
	public List<Map<String, Object>> getItemValidOptions(String itemName) {
		return priceRepository.findValidOptionsByItem(itemName);
	}
	
	
	// 상세 페이지
	// ProductService.java 파일 내부 빈 공간에 추가

	@Transactional
	public Map<String, Object> getProductAnalysisDetail(Long productId, String region) {
	    String targetRegion = (region == null || region.isEmpty()) ? "서울" : region;
	    
	    // 1. 상품 기본 마스터 정보 확보
	    Product product = productRepository.findById(productId)
	            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다."));
	            
	    Map<String, Object> analysisMap = new HashMap<>();
	    analysisMap.put("productId", product.getProductId());
	    analysisMap.put("itemName", product.getItemName());
	    analysisMap.put("kindName", product.getKindName());
	    analysisMap.put("category", product.getCategory());

	    // 2. 해당 상품 고유 ID와 지역을 조건으로 가격 이력 리스트 호출
	    List<Map<String, Object>> priceDetails = productRepository.findAllByNameAndRegion(targetRegion, product.getProductId());
	    
	    if (priceDetails != null && !priceDetails.isEmpty()) {
	        // [방어선] 정렬 규칙상 0번째 인덱스가 무조건 '가장 최신 날짜'의 시세 데이터 한 줄입니다.
	        Map<String, Object> latestPrice = priceDetails.get(0);
	        
	        double avgPrice = ((Number) latestPrice.get("avgPrice")).doubleValue();
	        double minPrice = ((Number) latestPrice.get("minPrice")).doubleValue();
	        double maxPrice = ((Number) latestPrice.get("maxPrice")).doubleValue();
	        
	        analysisMap.put("avgPrice", (int) avgPrice);
	        analysisMap.put("minPrice", (int) minPrice);
	        analysisMap.put("maxPrice", (int) maxPrice);
	        analysisMap.put("unitSz", latestPrice.get("unitSz"));
	        analysisMap.put("unit", latestPrice.get("unit"));
	        analysisMap.put("rankName", latestPrice.get("rankName"));
	        analysisMap.put("viewCount", product.getViewCount());
	        
	        // ------------------------------------------------------------------
	        // 📊 [AI 지표 1] 물가 지수 가성비 스코어 연산 (0점 ~ 100점)
	        // ------------------------------------------------------------------
	        int costEffectiveScore = 100;
	        if (maxPrice != minPrice) {
	            costEffectiveScore = (int) (100 - ((avgPrice - minPrice) / (maxPrice - minPrice) * 100));
	        }
	        analysisMap.put("costEffectiveScore", Math.max(0, Math.min(100, costEffectiveScore)));
	        
	        // ------------------------------------------------------------------
	        // ⚠️ [AI 지표 2] 시장 가격 변동폭 위험도 연산
	        // ------------------------------------------------------------------
	        double volatility = 0.0;
	        if (avgPrice > 0) {
	            volatility = ((maxPrice - minPrice) / avgPrice) * 100;
	        }
	        
	        String priceRiskLevel = "안정";
	        if (volatility > 40) {
	            priceRiskLevel = "위험";
	        } else if (volatility > 20) {
	            priceRiskLevel = "경계";
	        }
	        
	        analysisMap.put("priceVolatility", Math.round(volatility * 10) / 10.0); // 소수점 첫째자리 마감
	        analysisMap.put("priceRiskLevel", priceRiskLevel);
	        
	    } else {
	        // [예외 방어선] 데이터가 하나도 매칭되지 않을 때 프론트엔드가 Null을 참조해 깨지는 현상 방지
	        analysisMap.put("avgPrice", null);
	        analysisMap.put("minPrice", null);
	        analysisMap.put("maxPrice", null);
	        analysisMap.put("unitSz", "-");
	        analysisMap.put("unit", "");
	        analysisMap.put("rankName", "일반");
	        analysisMap.put("viewCount", product.getViewCount());
	        analysisMap.put("costEffectiveScore", 0);
	        analysisMap.put("priceVolatility", 0.0);
	        analysisMap.put("priceRiskLevel", "정보없음");
	    }
	    
	    return analysisMap;
	}
}
