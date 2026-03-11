package com.p2pconnect.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final PathConfig.PathsHolder paths;

    public WebConfig(PathConfig.PathsHolder paths) {
        this.paths = paths;
    }

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // Serve uploads
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(paths.uploadsDir().toUri().toString());
        // Serve entire frontEnd directory (scripts, assets, etc.)
        registry.addResourceHandler("/**")
                .addResourceLocations(paths.frontEndDir().toUri().toString(),
                        paths.htmlDir().toUri().toString());
    }

    @Override
    public void addViewControllers(@NonNull ViewControllerRegistry registry) {
        // Map root to LoginPage_02.html
        registry.addViewController("/").setViewName("forward:/HTML/LoginPage_02.html");
    }
}
