package com.hockeyhero.repository;

import com.hockeyhero.domain.HeroKeys;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the HeroKeys entity.
 */
@SuppressWarnings("unused")
@Repository
public interface HeroKeysRepository extends JpaRepository<HeroKeys, Long> {}
