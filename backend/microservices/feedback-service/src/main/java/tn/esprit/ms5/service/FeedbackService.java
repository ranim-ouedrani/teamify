
package tn.esprit.ms5.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.ms5.entity.Feedback;
import tn.esprit.ms5.repository.FeedbackRepository;

import java.util.List;

@Service
@RequiredArgsConstructor

public class FeedbackService implements IfeedbackService
{
    final FeedbackRepository FR;

    @Override
    public List<Feedback> retrieveAllFeedbacks() {
        return (List<Feedback>) FR.findAll();
    }

    @Override
    public Feedback addFeedback(Feedback f) {
        return FR.save(f);
    }

    @Override
    public Feedback updateFeedback(Feedback f) {
        return FR.save(f);
    }

    @Override
    public Feedback retrieveFeedback(Long idFeedback) {
        return FR.findById(idFeedback).orElse(null);
    }

    @Override
    public void removeFeedback(Long idFeedback) {
        FR.deleteById(idFeedback);
    }

}
