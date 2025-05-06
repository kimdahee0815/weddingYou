package com.mysite.weddingyou_backend;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
	
	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**")
        .allowedOriginPatterns("https://weddingyou-dahee-kim.netlify.app", "http://localhost:*")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .exposedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
		
	}

}
