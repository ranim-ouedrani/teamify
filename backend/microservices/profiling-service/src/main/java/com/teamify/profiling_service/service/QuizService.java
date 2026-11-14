package com.teamify.profiling_service.service;

import com.teamify.profiling_service.dto.Dto.QuestionRequest;
import com.teamify.profiling_service.dto.Dto.QuizCreateRequest;
import com.teamify.profiling_service.dto.Dto.QuizResponse;
import com.teamify.profiling_service.dto.Dto.SoumissionRequest;
import com.teamify.profiling_service.dto.Dto.ValidationRequest;
import com.teamify.profiling_service.entity.Competence;
import com.teamify.profiling_service.entity.Enseignant;
import com.teamify.profiling_service.entity.Etudiant;
import com.teamify.profiling_service.entity.Question;
import com.teamify.profiling_service.entity.QuizEvaluation;
import com.teamify.profiling_service.repository.CompetenceRepository;
import com.teamify.profiling_service.repository.EnseignantRepository;
import com.teamify.profiling_service.repository.EtudiantRepository;
import com.teamify.profiling_service.repository.QuizEvaluationRepository;
import com.teamify.profiling_service.util.Statuts;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizEvaluationRepository quizRepository;
    private final EnseignantRepository enseignantRepository;
    private final EtudiantRepository etudiantRepository;
    private final CompetenceRepository competenceRepository;

    /** L'enseignant crée une évaluation pour un étudiant, liée aux compétences à certifier. */
    @Transactional
    public QuizResponse creer(UUID enseignantId, QuizCreateRequest req) {
        Enseignant enseignant = enseignantRepository.findById(enseignantId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enseignant introuvable"));
        Etudiant etudiant = etudiantRepository.findById(req.etudiantId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Étudiant introuvable"));

        List<Competence> competences = competenceRepository.findAllById(req.competenceIds());
        if (competences.size() != new HashSet<>(req.competenceIds()).size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Une des compétences est introuvable");
        }
        for (Competence c : competences) {
            if (c.getEtudiant() == null || !c.getEtudiant().getId().equals(etudiant.getId())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "La compétence « " + c.getNom() + " » n'appartient pas à cet étudiant");
            }
        }

        QuizEvaluation quiz = new QuizEvaluation();
        quiz.setTitre(req.titre().trim());
        quiz.setEnseignant(enseignant);
        quiz.setEtudiant(etudiant);
        quiz.setScoreObtenu(0);
        quiz.setStatutValidation(Statuts.QUIZ_A_PASSER);
        quiz.setCompetencesCertifiees(new ArrayList<>(competences));
        for (QuestionRequest qr : req.questions()) {
            Question q = new Question();
            q.setTexte(qr.texte().trim());
            q.setReponseCorrecte(qr.reponseCorrecte().trim());
            q.setQuiz(quiz);
            quiz.getQuestions().add(q);
        }
        return Mapper.quiz(quizRepository.save(quiz));
    }

    /** Quiz d'un étudiant (les bonnes réponses ne sont jamais renvoyées). */
    @Transactional(readOnly = true)
    public List<QuizResponse> quizDeLEtudiant(UUID etudiantId) {
        if (!etudiantRepository.existsById(etudiantId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Étudiant introuvable");
        }
        return quizRepository.findByEtudiantId(etudiantId).stream().map(Mapper::quiz).toList();
    }

    /** L'étudiant passe le quiz : le score (sur 20) est calculé automatiquement. */
    @Transactional
    public QuizResponse soumettre(UUID quizId, SoumissionRequest req) {
        QuizEvaluation quiz = trouver(quizId);
        if (quiz.getEtudiant() == null || !quiz.getEtudiant().getId().equals(req.etudiantId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Ce quiz est destiné à un autre étudiant");
        }
        if (!Statuts.QUIZ_A_PASSER.equals(quiz.getStatutValidation())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ce quiz a déjà été passé");
        }

        int total = quiz.getQuestions().size();
        int bonnes = 0;
        for (Question q : quiz.getQuestions()) {
            String reponse = req.reponses().get(q.getId());
            if (reponse != null && reponse.trim().equalsIgnoreCase(q.getReponseCorrecte().trim())) {
                bonnes++;
            }
        }
        double score = total == 0 ? 0 : Math.round(bonnes * 20.0 / total * 100) / 100.0;
        quiz.setScoreObtenu(score);
        quiz.setStatutValidation(Statuts.QUIZ_EN_ATTENTE_VALIDATION);
        return Mapper.quiz(quiz);
    }

    @Transactional(readOnly = true)
    public List<QuizResponse> aValider(UUID enseignantId) {
        if (!enseignantRepository.existsById(enseignantId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Enseignant introuvable");
        }
        return quizRepository.findByEnseignantIdAndStatutValidation(enseignantId, Statuts.QUIZ_EN_ATTENTE_VALIDATION)
                .stream().map(Mapper::quiz).toList();
    }

    /** L'enseignant valide ou refuse : si validé, les compétences liées deviennent certifiées. */
    @Transactional
    public QuizResponse valider(UUID quizId, ValidationRequest req) {
        QuizEvaluation quiz = trouver(quizId);
        if (quiz.getEnseignant() == null || !quiz.getEnseignant().getId().equals(req.enseignantId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Seul l'enseignant du quiz peut le valider");
        }
        if (!Statuts.QUIZ_EN_ATTENTE_VALIDATION.equals(quiz.getStatutValidation())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ce quiz n'est pas en attente de validation");
        }
        if (req.valide()) {
            quiz.setStatutValidation(Statuts.QUIZ_VALIDE);
            quiz.getCompetencesCertifiees().forEach(c -> c.setStatut(Statuts.COMPETENCE_CERTIFIEE));
        } else {
            quiz.setStatutValidation(Statuts.QUIZ_REFUSE);
        }
        return Mapper.quiz(quiz);
    }

    private QuizEvaluation trouver(UUID id) {
        return quizRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quiz introuvable"));
    }
}
