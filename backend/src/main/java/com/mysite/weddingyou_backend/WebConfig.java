package com.mysite.weddingyou_backend;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.mysite.weddingyou_backend.item.StringToCategory1Converter;
import com.mysite.weddingyou_backend.item.StringToCategory2Converter;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	@Autowired
	private StringToCategory1Converter stringToCategory1Converter;

	@Autowired
	private StringToCategory2Converter stringToCategory2Converter;

	@Override
	public void addFormatters(FormatterRegistry registry) {
		registry.addConverter(stringToCategory1Converter);
		registry.addConverter(stringToCategory2Converter);
	}

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**")
            .allowedOrigins(
                "https://weddingyou-dahee-kim.netlify.app",
                "http://localhost:3000",
                "http://localhost:80"
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .exposedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
		
	}

}
