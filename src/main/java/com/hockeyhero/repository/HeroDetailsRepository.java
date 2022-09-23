package com.hockeyhero.repository;

import com.hockeyhero.domain.HeroDetails;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the HeroDetails entity.
 */
@SuppressWarnings("unused")
@Repository
public interface HeroDetailsRepository extends JpaRepository<HeroDetails, Long> {}
