package tn.esprit.ms5.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Feedback
{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idFeedback;

    @Column
    private Long studentId;

    @Column
    private Long groupId;

    @Column(nullable = false)
    private Integer communication;
    @Column(nullable = false)
    private Integer participation;

    @Column(nullable = false)
    private Integer responsibility;

    @Column(nullable = false)
    private Integer mutualHelp;

    @Column(nullable = false)
    private Integer groupAtmosphere;

    @Column(length = 500)
    private String comment;

    @Column(nullable = false)
    private Boolean confidential;

    @Column(nullable = false)
    private LocalDateTime createdAt;



}
