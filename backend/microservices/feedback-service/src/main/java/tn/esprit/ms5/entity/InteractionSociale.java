package tn.esprit.ms5.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "interactionSociale")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class InteractionSociale
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idInteraction;

    @Column
    private Long studentId;

    @Column
    private Long groupId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InteractionType type;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InteractionStatus status;

    @Column
    private Long receiverId;

    @Column
    private Long parentInteractionId;

    @OneToMany(mappedBy = "interactionSociale")
    private List<Rapport> rapports = new ArrayList<>();


}
