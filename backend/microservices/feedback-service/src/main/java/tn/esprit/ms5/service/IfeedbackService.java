package tn.esprit.ms5.service;
import tn.esprit.ms5.entity.Feedback;
import java.util.List;

public interface IfeedbackService
{
    List<Feedback> retrieveAllFeedbacks();
    Feedback addFeedback(Feedback f);
    Feedback updateFeedback(Feedback f);
    Feedback retrieveFeedback(Long idFeedback);
    void removeFeedback(Long idFeedback);

}
