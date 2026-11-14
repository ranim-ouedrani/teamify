package tn.esprit.ms5.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "rapport")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Rapport
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idReport;

    @Column
    private Long studentId;

    @Column
    private Long groupId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportType type;

    @Column(length = 1000)
    private String description;

    @Column
    private Long reportedContentId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportStatus status;

    @Column
    private Long moderatorId;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "interaction_id")
    private InteractionSociale interactionSociale;

}
