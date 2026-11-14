package com.reboistn.gamification.repository;

import com.reboistn.gamification.entity.Avatar;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AvatarRepository extends JpaRepository<Avatar, Long> {
}
