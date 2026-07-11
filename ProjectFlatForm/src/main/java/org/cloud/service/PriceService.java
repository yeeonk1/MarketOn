package org.cloud.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.cloud.domain.PriceHistory;
import org.cloud.domain.Product;
import org.cloud.dto.PriceDTO;
import org.cloud.repository.PriceRepository;
import org.cloud.repository.ProductRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PriceService {
	
	private final PriceRepository priceRepository;
	private final ProductRepository productRepository;
	
	private int parsePrice(String raw) {
	    if (raw == null || raw.isEmpty()) return 0;
	    return Integer.parseInt(raw.replaceAll(",", ""));
	}
	
	private static final DateTimeFormatter DATE_FORMATTER =
	        DateTimeFormatter.ofPattern("yyyyMMdd");
	
	public void savePrices(List<PriceDTO> dtos) {

	    System.out.println("🔥 savePrices 실행됨, 데이터 개수: " + dtos.size());

	    for (PriceDTO dto : dtos) {
	        if (dto.getItemName() == null || dto.getKindName() == null) {
	            continue;
	        }

	        int price = parsePrice(dto.getAvgPrice());
	        LocalDate date = LocalDate.parse(dto.getDate(), DATE_FORMATTER);
	        
	        Product product = productRepository
	                .findByItemNameAndKindName(dto.getItemName(), dto.getKindName())
	                .orElseGet(() -> productRepository.save(
	                        Product.builder()
	                        		.categoryCode(dto.getCategoryCode())
	                        		.itemCode(dto.getItemCode())
	                        		.kindCode(dto.getKindCode())
	                        		.category(dto.getCategory())
	                        		.kindName(dto.getKindName())
	                        		.itemName(dto.getItemName())
	                        		.unitSz(dto.getUnitSz())
	                        		.build()
	                ));

	        String region = dto.getRegion() != null ? dto.getRegion() : "UNKNOWN";
	        String rankName = dto.getRankName() != null ? dto.getRankName() : "UNKNOWN";

	        String regionCode = dto.getRegionCode() != null ? dto.getRegionCode() : "UNKNOWN";
	        String rankCode = dto.getRankCode() != null ? dto.getRankCode() : "UNKNOWN";
	        
	        int minPrice = parsePrice(dto.getMinPrice());
	        int maxPrice = parsePrice(dto.getMaxPrice());
	        
	        PriceHistory history = PriceHistory.builder()
	                .productId(product)
	                .avgPrice(price)
	                .minPrice(minPrice)
	                .maxPrice(maxPrice)
	                .kindName(dto.getKindName())
	                .date(date)
	                .region(region)
	                .regionCode(regionCode)
	                .rankName(rankName)
	                .rankCode(rankCode)
	                .unit(dto.getUnit() != null ? dto.getUnit() : "단위없음")
	                .build();

	        priceRepository.save(history);

	        System.out.println("저장: " + dto.getItemName() + " / " + price);
	    }
	}
}
