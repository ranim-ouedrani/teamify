package com.reboistn.gamification.exception;

public class AvatarNotFoundException extends RuntimeException {

    public AvatarNotFoundException(Long id) {
        super("Avatar introuvable avec l'id " + id);
    }
}
