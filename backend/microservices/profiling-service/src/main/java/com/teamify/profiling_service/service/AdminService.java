package com.teamify.profiling_service.service;

import com.teamify.profiling_service.dto.Dto.AffectationRequest;
import com.teamify.profiling_service.dto.Dto.EnseignantRequest;
import com.teamify.profiling_service.dto.Dto.EnseignantResponse;
import com.teamify.profiling_service.dto.Dto.ImportReport;
import com.teamify.profiling_service.dto.Dto.UtilisateurResponse;
import com.teamify.profiling_service.entity.Enseignant;
import com.teamify.profiling_service.entity.Etudiant;
import com.teamify.profiling_service.entity.Role;
import com.teamify.profiling_service.repository.EnseignantRepository;
import com.teamify.profiling_service.repository.EtudiantRepository;
import com.teamify.profiling_service.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class AdminService {

    private static final Pattern EMAIL = Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");

    private final UtilisateurRepository utilisateurRepository;
    private final EtudiantRepository etudiantRepository;
    private final EnseignantRepository enseignantRepository;

    // ---------- Import CSV des étudiants ----------

    /**
     * En-tête attendu : email;nom;prenom;identifiant;gpa (séparateur ; ou ,).
     * Les lignes invalides sont rejetées et listées dans le rapport, les autres sont importées.
     */
    @Transactional
    public ImportReport importerEtudiants(MultipartFile fichier) {
        if (fichier == null || fichier.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Fichier CSV vide ou manquant");
        }

        List<String> erreurs = new ArrayList<>();
        List<Etudiant> aSauver = new ArrayList<>();
        Set<String> emailsVus = new HashSet<>();
        Set<String> identifiantsVus = new HashSet<>();
        int lues = 0;

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(fichier.getInputStream(), StandardCharsets.UTF_8))) {

            String entete = reader.readLine();
            if (entete == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Fichier CSV vide");
            }
            entete = entete.replace("\uFEFF", "");
            String sep = entete.contains(";") ? ";" : ",";
            List<String> colonnes = Arrays.stream(entete.split(sep)).map(s -> s.trim().toLowerCase()).toList();

            int iEmail = colonnes.indexOf("email");
            int iNom = colonnes.indexOf("nom");
            int iPrenom = colonnes.indexOf("prenom");
            int iId = colonnes.indexOf("identifiant");
            int iGpa = colonnes.indexOf("gpa");
            if (iEmail < 0 || iNom < 0 || iPrenom < 0 || iId < 0 || iGpa < 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "En-tête attendu : email;nom;prenom;identifiant;gpa");
            }
            int maxIndex = Math.max(Math.max(iEmail, iNom), Math.max(Math.max(iPrenom, iId), iGpa));

            String ligne;
            int numero = 1;
            while ((ligne = reader.readLine()) != null) {
                numero++;
                if (ligne.isBlank()) {
                    continue;
                }
                lues++;
                String[] p = ligne.split(sep, -1);
                if (p.length <= maxIndex) {
                    erreurs.add("Ligne " + numero + " : colonnes manquantes");
                    continue;
                }

                String email = p[iEmail].trim().toLowerCase();
                String nom = p[iNom].trim();
                String prenom = p[iPrenom].trim();
                String identifiant = p[iId].trim();
                String gpaTexte = p[iGpa].trim().replace(',', '.');

                String erreur = null;
                double gpa = 0;
                if (!EMAIL.matcher(email).matches()) {
                    erreur = "e-mail invalide";
                } else if (nom.isEmpty() || prenom.isEmpty()) {
                    erreur = "nom ou prénom manquant";
                } else if (identifiant.isEmpty()) {
                    erreur = "identifiant manquant";
                } else {
                    try {
                        gpa = Double.parseDouble(gpaTexte);
                        if (gpa < 0 || gpa > 20) {
                            erreur = "moyenne hors de l'intervalle 0 à 20";
                        }
                    } catch (NumberFormatException ex) {
                        erreur = "moyenne invalide";
                    }
                }
                if (erreur == null && (!emailsVus.add(email) || utilisateurRepository.existsByEmailIgnoreCase(email))) {
                    erreur = "e-mail en doublon";
                }
                if (erreur == null && (!identifiantsVus.add(identifiant) || etudiantRepository.existsByIdentifiant(identifiant))) {
                    erreur = "identifiant en doublon";
                }
                if (erreur != null) {
                    erreurs.add("Ligne " + numero + " : " + erreur);
                    continue;
                }

                Etudiant e = new Etudiant();
                e.setEmail(email);
                e.setNom(nom);
                e.setPrenom(prenom);
                e.setRole(Role.ETUDIANT);
                e.setIdentifiant(identifiant);
                e.setGpa(gpa);
                aSauver.add(e);
            }
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Lecture du fichier impossible");
        }

        etudiantRepository.saveAll(aSauver);
        return new ImportReport(lues, aSauver.size(), erreurs.size(), erreurs);
    }

    // ---------- Enseignants ----------

    @Transactional
    public EnseignantResponse creerEnseignant(EnseignantRequest req) {
        String email = req.email().trim().toLowerCase();
        if (utilisateurRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Cet e-mail existe déjà");
        }
        Enseignant e = new Enseignant();
        e.setEmail(email);
        e.setNom(req.nom().trim());
        e.setPrenom(req.prenom().trim());
        e.setRole(Role.ENSEIGNANT);
        e.setModuleId(req.moduleId());
        if (req.classIds() != null) {
            e.setClassIds(new ArrayList<>(req.classIds()));
        }
        return Mapper.enseignant(enseignantRepository.save(e));
    }

    /** L'administrateur affecte (ou change) le module et les classes d'un enseignant. */
    @Transactional
    public EnseignantResponse affecter(UUID enseignantId, AffectationRequest req) {
        Enseignant e = enseignantRepository.findById(enseignantId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enseignant introuvable"));
        e.setModuleId(req.moduleId());
        e.getClassIds().clear();
        if (req.classIds() != null) {
            e.getClassIds().addAll(req.classIds());
        }
        return Mapper.enseignant(e);
    }

    @Transactional(readOnly = true)
    public List<EnseignantResponse> listerEnseignants() {
        return enseignantRepository.findAll().stream().map(Mapper::enseignant).toList();
    }

    // ---------- Tous les comptes ----------

    @Transactional(readOnly = true)
    public List<UtilisateurResponse> listerUtilisateurs() {
        return utilisateurRepository.findAll().stream().map(Mapper::utilisateur).toList();
    }
}
