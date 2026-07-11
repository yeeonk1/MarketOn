package org.cloud.controller;

import java.util.List;
import java.util.Map;

import org.cloud.service.APIService;
import org.cloud.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
@RequestMapping("/api/products")
public class ApiController {

	private final APIService apiService;
	private final ProductService productService;


	@GetMapping("/collect")
	public String collect() {
		apiService.fetchAndSave();
		return "데이터 수집 완료";
	}
	
	@GetMapping("/popular")
	public ResponseEntity<List<Map<String, Object>>> getPopular(
			@RequestParam(name = "region", defaultValue = "서울") String region,
			@RequestParam(name = "isAll", defaultValue = "false") boolean isAll) {
		
		if (isAll) {
			return ResponseEntity.ok(productService.getAllPopular(region));
		}
		return ResponseEntity.ok(productService.getMainPopular(region));
	}
	
	@GetMapping("/fluctuation")
	public ResponseEntity<List<Map<String, Object>>> getFluctuation(
			@RequestParam(name = "region", defaultValue = "서울") String region,
			@RequestParam(name = "isAll", defaultValue = "false") boolean isAll) {
		
		if (isAll) {
			return ResponseEntity.ok(productService.getAllDrop(region));
		}
		return ResponseEntity.ok(productService.getMainDrop(region));
	}
	
	@GetMapping("/detail/{productId}")
	public ResponseEntity<Map<String, Object>> getProductDetailAnalysis(
			@PathVariable(name = "productId") Long productId,
			@RequestParam(name = "region", defaultValue = "서울") String region) {
		Map<String, Object> analysis = productService.getProductAnalysisDetail(productId, region);
		return ResponseEntity.ok(analysis);
	}
	
	@GetMapping("/bargainTop")
	public ResponseEntity<Map<String, Object>> getMainTopBargain(
			@RequestParam(name = "region", defaultValue = "서울") String region) {
		Map<String, Object> topBargain = productService.getMainTopBargain(region);
		return ResponseEntity.ok(topBargain);
	}
	
	@GetMapping("/bargainList")
	public ResponseEntity<List<Map<String, Object>>> getBargainList(
			@RequestParam(name = "region", defaultValue = "서울") String region) {
		List<Map<String, Object>> bargainList = productService.getBargainList(region);
		return ResponseEntity.ok(bargainList);
	}
	
	@GetMapping("/search")
	public ResponseEntity<List<Map<String, Object>>> getSearch(
			@RequestParam("keyword") String keyword,
			@RequestParam(name = "region", defaultValue = "서울") String region) {
		List<Map<String, Object>> results = productService.searchProducts(keyword, region);
	    return ResponseEntity.ok(results);
	}
	
	@GetMapping("/analysis")
	public ResponseEntity<List<Map<String, Object>>> getMarketAnalysis(
	        @RequestParam(name = "itemName", defaultValue = "배추") String itemName,
	        @RequestParam(name = "region", defaultValue = "서울") String region,
	        @RequestParam(name = "period", defaultValue = "30") int period,
	        @RequestParam(name = "kindName", required = false) String kindName,
	        @RequestParam(name = "rankName") String rankName,
	        @RequestParam(name = "unitSz") String unitSz,
	        @RequestParam(name = "unit") String unit) {
	    
	    List<Map<String, Object>> analysisData = productService.getDailyPriceAnalysis(
	    		itemName, region, period, kindName, rankName, unitSz, unit);
	    return ResponseEntity.ok(analysisData);
	}
	
	@GetMapping("/analysis/options")
	public ResponseEntity<List<Map<String, Object>>> getItemOptions(
			@RequestParam(name = "itemName", defaultValue = "배추") String itemName) {
		List<Map<String, Object>> options = productService.getItemValidOptions(itemName);
		return ResponseEntity.ok(options);
	}
}
