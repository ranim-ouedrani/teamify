
package tn.esprit.ms5.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.ms5.entity.Feedback;
import tn.esprit.ms5.service.IfeedbackService;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/feedback")
public class FeedbackController {

    final IfeedbackService ifeedback;

    @PostMapping("/AddFeedback")
    public Feedback AddFeedback(@RequestBody Feedback f) {
        return ifeedback.addFeedback(f);
    }

    @GetMapping("/listFeedbacks")
    public List<Feedback> getFeedbacks() {
        return ifeedback.retrieveAllFeedbacks();
    }

    @GetMapping("/retrieveFeedback/{idF}")
    public Feedback retrieveFeedback(@PathVariable Long idF) {
        return ifeedback.retrieveFeedback(idF);
    }

    @PostMapping("/DeleteFeedback/{idF}")
    public void DeleteFeedback(@PathVariable Long idF) {
        ifeedback.removeFeedback(idF);
    }


    @PutMapping("/UpdateFeedback")
    public Feedback UpdateFeedback(@RequestBody Feedback f) {
        return ifeedback.updateFeedback(f);
    }
}
