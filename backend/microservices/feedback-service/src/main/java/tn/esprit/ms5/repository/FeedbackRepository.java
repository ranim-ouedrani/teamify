
package tn.esprit.ms5.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.ms5.entity.Feedback;

@Repository
public interface FeedbackRepository extends CrudRepository<Feedback, Long> {

}
