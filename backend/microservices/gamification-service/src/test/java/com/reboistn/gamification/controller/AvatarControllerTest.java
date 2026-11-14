package com.reboistn.gamification.controller;

import com.reboistn.gamification.dto.AvatarResponse;
import com.reboistn.gamification.exception.AvatarNotFoundException;
import com.reboistn.gamification.service.AvatarService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AvatarController.class)
class AvatarControllerTest {

    private static final String VALID_BODY = """
            {"nom": "Renard curieux", "imageUrl": "https://exemple.com/renard.png", "categorie": "Animaux", "actif": true}
            """;

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AvatarService avatarService;

    private AvatarResponse renard() {
        return new AvatarResponse(1L, "Renard curieux", "https://exemple.com/renard.png", "Animaux", true);
    }

    @Test
    void createReturns201() throws Exception {
        when(avatarService.create(any())).thenReturn(renard());

        mockMvc.perform(post("/avatars").contentType(MediaType.APPLICATION_JSON).content(VALID_BODY))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nom").value("Renard curieux"))
                .andExpect(jsonPath("$.actif").value(true));
    }

    @Test
    void createWithBlankNomReturns400() throws Exception {
        mockMvc.perform(post("/avatars").contentType(MediaType.APPLICATION_JSON).content("{\"nom\": \"  \"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.nom").exists());
    }

    @Test
    void findAllReturnsList() throws Exception {
        when(avatarService.findAll()).thenReturn(List.of(renard()));

        mockMvc.perform(get("/avatars"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].categorie").value("Animaux"));
    }

    @Test
    void findByIdReturnsAvatar() throws Exception {
        when(avatarService.findById(1L)).thenReturn(renard());

        mockMvc.perform(get("/avatars/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nom").value("Renard curieux"));
    }

    @Test
    void findByIdUnknownReturns404() throws Exception {
        when(avatarService.findById(99L)).thenThrow(new AvatarNotFoundException(99L));

        mockMvc.perform(get("/avatars/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Avatar introuvable avec l'id 99"));
    }

    @Test
    void findByIdNonNumericReturns400() throws Exception {
        mockMvc.perform(get("/avatars/abc"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateReturns200() throws Exception {
        when(avatarService.update(eq(1L), any())).thenReturn(renard());

        mockMvc.perform(put("/avatars/1").contentType(MediaType.APPLICATION_JSON).content(VALID_BODY))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void deleteReturns204() throws Exception {
        mockMvc.perform(delete("/avatars/1"))
                .andExpect(status().isNoContent());

        verify(avatarService).delete(1L);
    }

    @Test
    void deleteUnknownReturns404() throws Exception {
        doThrow(new AvatarNotFoundException(99L)).when(avatarService).delete(99L);

        mockMvc.perform(delete("/avatars/99"))
                .andExpect(status().isNotFound());
    }
}
