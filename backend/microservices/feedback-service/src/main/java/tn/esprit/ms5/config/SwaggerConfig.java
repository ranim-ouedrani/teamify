
package tn.esprit.ms5.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("MS5 - Feedback et vie sociale API")
                        .version("1.0")
                        .description("API de gestion des feedbacks et des interactions sociales"));
    }
}
