package com.teamify.profiling_service.service;

import com.teamify.profiling_service.dto.Dto.CompetenceRequest;
import com.teamify.profiling_service.dto.Dto.CompetenceResponse;
import com.teamify.profiling_service.dto.Dto.EtudiantResponse;
import com.teamify.profiling_service.dto.Dto.EtudiantUpdateRequest;
import com.teamify.profiling_service.entity.Competence;
import com.teamify.profiling_service.entity.Etudiant;
import com.teamify.profiling_service.repository.CompetenceRepository;
import com.teamify.profiling_service.repository.EtudiantRepository;
import com.teamify.profiling_service.util.Statuts;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EtudiantService {

    private final EtudiantRepository etudiantRepository;
    private final CompetenceRepository competenceRepository;

    @Transactional(readOnly = true)
    public EtudiantResponse get(UUID id) {
        return Mapper.etudiant(trouver(id));
    }

    /** L'étudiant ne modifie que sa bio et sa photo : nom, prénom, e-mail et moyenne viennent du CSV. */
    @Transactional
    public EtudiantResponse modifier(UUID id, EtudiantUpdateRequest req) {
        Etudiant e = trouver(id);
        if (req.bio() != null) {
            e.setBio(req.bio());
        }
        if (req.photo() != null) {
            e.setPhoto(req.photo());
        }
        return Mapper.etudiant(e);
    }

    @Transactional(readOnly = true)
    public List<CompetenceResponse> competences(UUID etudiantId) {
        trouver(etudiantId);
        return competenceRepository.findByEtudiantId(etudiantId).stream().map(Mapper::competence).toList();
    }

    /** Seules les compétences certifiées sont visibles par les autres. */
    @Transactional(readOnly = true)
    public List<CompetenceResponse> competencesCertifiees(UUID etudiantId) {
        trouver(etudiantId);
        return competenceRepository.findByEtudiantIdAndStatut(etudiantId, Statuts.COMPETENCE_CERTIFIEE)
                .stream().map(Mapper::competence).toList();
    }

    @Transactional
    public CompetenceResponse ajouterCompetence(UUID etudiantId, CompetenceRequest req) {
        Etudiant e = trouver(etudiantId);
        String nom = req.nom().trim();
        boolean existe = e.getCompetences().stream().anyMatch(c -> c.getNom().equalsIgnoreCase(nom));
        if (existe) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Cette compétence existe déjà : " + nom);
        }
        Competence c = new Competence();
        c.setNom(nom);
        c.setNiveau(req.niveau());
        c.setStatut(Statuts.COMPETENCE_DECLAREE);
        c.setEtudiant(e);
        e.getCompetences().add(c);
        return Mapper.competence(competenceRepository.save(c));
    }

    @Transactional
    public void supprimerCompetence(UUID etudiantId, UUID competenceId) {
        Etudiant e = trouver(etudiantId);
        Competence c = competenceRepository.findById(competenceId)
                .filter(x -> x.getEtudiant() != null && x.getEtudiant().getId().equals(etudiantId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Compétence introuvable"));
        if (Statuts.COMPETENCE_CERTIFIEE.equals(c.getStatut())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Une compétence certifiée ne peut pas être supprimée");
        }
        if (!c.getQuizCertifiants().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Cette compétence est liée à un quiz");
        }
        e.getCompetences().remove(c);
    }

    private Etudiant trouver(UUID id) {
        return etudiantRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Étudiant introuvable"));
    }
}
