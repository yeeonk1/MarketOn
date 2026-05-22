package org.cloud.config;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

@Configuration
@MapperScan("org.cloud.mapper")
public class MybatisConfig {
	
	@Bean
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
        SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
        
        // 1. 데이터소스 설정 (JPA와 공유)
        sessionFactory.setDataSource(dataSource);
        
        // 2. XML 매퍼 위치 설정 (경로를 명시적으로 지정)
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        sessionFactory.setMapperLocations(resolver.getResources("classpath:mapper/*.xml"));
        
        // 3. (선택) 카멜케이스 자동 변환 등 추가 설정 가능
        org.apache.ibatis.session.Configuration mybatisConfig = new org.apache.ibatis.session.Configuration();
        mybatisConfig.setMapUnderscoreToCamelCase(true);
        sessionFactory.setConfiguration(mybatisConfig);

        return sessionFactory.getObject();
    }
}
