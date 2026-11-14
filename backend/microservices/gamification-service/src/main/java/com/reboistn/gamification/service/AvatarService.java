package com.reboistn.gamification.service;

import com.reboistn.gamification.dto.AvatarRequest;
import com.reboistn.gamification.dto.AvatarResponse;
import com.reboistn.gamification.entity.Avatar;
import com.reboistn.gamification.exception.AvatarNotFoundException;
import com.reboistn.gamification.repository.AvatarRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class AvatarService {

    private final AvatarRepository avatarRepository;

    public AvatarService(AvatarRepository avatarRepository) {
        this.avatarRepository = avatarRepository;
    }

    @Transactional
    public AvatarResponse create(AvatarRequest request) {
        Avatar avatar = new Avatar();
        avatar.setNom(request.nom().trim());
        avatar.setImageUrl(request.imageUrl());
        avatar.setCategorie(request.categorie());
        avatar.setActif(request.actif() == null || request.actif());
        return AvatarResponse.from(avatarRepository.save(avatar));
    }

    public List<AvatarResponse> findAll() {
        return avatarRepository.findAll().stream()
                .map(AvatarResponse::from)
                .toList();
    }

    public AvatarResponse findById(Long id) {
        return AvatarResponse.from(getOrThrow(id));
    }

    @Transactional
    public AvatarResponse update(Long id, AvatarRequest request) {
        Avatar avatar = getOrThrow(id);
        avatar.setNom(request.nom().trim());
        avatar.setImageUrl(request.imageUrl());
        avatar.setCategorie(request.categorie());
        if (request.actif() != null) {
            avatar.setActif(request.actif());
        }
        return AvatarResponse.from(avatarRepository.save(avatar));
    }

    @Transactional
    public void delete(Long id) {
        avatarRepository.delete(getOrThrow(id));
    }

    private Avatar getOrThrow(Long id) {
        return avatarRepository.findById(id).orElseThrow(() -> new AvatarNotFoundException(id));
    }
}
