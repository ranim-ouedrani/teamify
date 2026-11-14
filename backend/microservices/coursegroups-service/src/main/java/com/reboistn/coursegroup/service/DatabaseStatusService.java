package com.reboistn.coursegroup.service;

import com.reboistn.coursegroup.dto.DatabaseStatusResponse;
import java.sql.Connection;
import java.sql.SQLException;
import javax.sql.DataSource;
import org.springframework.stereotype.Service;

@Service
public class DatabaseStatusService {

    private final DataSource dataSource;

    public DatabaseStatusService(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    /** Teste reellement la connexion a la base (pas de valeur codee en dur). */
    public DatabaseStatusResponse check() {
        try (Connection connection = dataSource.getConnection()) {
            boolean valid = connection.isValid(2);
            String details = connection.getMetaData().getDatabaseProductName()
                    + " " + connection.getMetaData().getDatabaseProductVersion()
                    + " / catalog=" + connection.getCatalog();
            return new DatabaseStatusResponse("MySQL", valid ? "UP" : "DOWN", details);
        } catch (SQLException e) {
            return new DatabaseStatusResponse("MySQL", "DOWN", e.getMessage());
        }
    }
}
