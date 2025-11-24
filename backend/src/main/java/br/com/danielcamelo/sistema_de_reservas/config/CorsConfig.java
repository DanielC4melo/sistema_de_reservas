package br.com.danielcamelo.sistema_de_reservas.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Permite que o Frontend (porta 5173) acesse qualquer parte do sistema (/**)
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173") // <--- O endereço do seu React
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "TRACE", "CONNECT");
    }
}