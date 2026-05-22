package org.cloud;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.cloud.domain.Product;
import org.cloud.repository.ProductRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class ProductRepositoryTest {

	@Autowired
	ProductRepository productRepository;
	
//	@Test
//	@DisplayName("상품 등록 테스트")
//	public void saveProductTest() {
//		Product product = Product.builder()
//				.category("채소류")
//				.categoryCode(100)
//				.itemName("양배추")
//				.itemCode(111)
//				.unit("1포기")
//				.build();
//		
//		
//		productRepository.save(product);
//		
//		List<Product> productList = productRepository.findAll();
//		Product saveProduct = productList.get(0);
//		
//		assertThat(saveProduct.getItemName()).isEqualTo("배추");
//		System.out.println(saveProduct.getItemName() + "이(가) 성공적으로 등록되었습니다.");
//	}
}
