package com.hockeyhero.web.rest;

import com.hockeyhero.domain.HeroDetails;
import com.hockeyhero.repository.HeroDetailsRepository;
import com.hockeyhero.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.hockeyhero.domain.HeroDetails}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class HeroDetailsResource {

    private final Logger log = LoggerFactory.getLogger(HeroDetailsResource.class);

    private static final String ENTITY_NAME = "heroDetails";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HeroDetailsRepository heroDetailsRepository;

    public HeroDetailsResource(HeroDetailsRepository heroDetailsRepository) {
        this.heroDetailsRepository = heroDetailsRepository;
    }

    /**
     * {@code POST  /hero-details} : Create a new heroDetails.
     *
     * @param heroDetails the heroDetails to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new heroDetails, or with status {@code 400 (Bad Request)} if the heroDetails has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/hero-details")
    public ResponseEntity<HeroDetails> createHeroDetails(@RequestBody HeroDetails heroDetails) throws URISyntaxException {
        log.debug("REST request to save HeroDetails : {}", heroDetails);
        if (heroDetails.getId() != null) {
            throw new BadRequestAlertException("A new heroDetails cannot already have an ID", ENTITY_NAME, "idexists");
        }
        HeroDetails result = heroDetailsRepository.save(heroDetails);
        return ResponseEntity
            .created(new URI("/api/hero-details/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /hero-details/:id} : Updates an existing heroDetails.
     *
     * @param id the id of the heroDetails to save.
     * @param heroDetails the heroDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated heroDetails,
     * or with status {@code 400 (Bad Request)} if the heroDetails is not valid,
     * or with status {@code 500 (Internal Server Error)} if the heroDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/hero-details/{id}")
    public ResponseEntity<HeroDetails> updateHeroDetails(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody HeroDetails heroDetails
    ) throws URISyntaxException {
        log.debug("REST request to update HeroDetails : {}, {}", id, heroDetails);
        if (heroDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, heroDetails.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!heroDetailsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        HeroDetails result = heroDetailsRepository.save(heroDetails);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, heroDetails.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /hero-details/:id} : Partial updates given fields of an existing heroDetails, field will ignore if it is null
     *
     * @param id the id of the heroDetails to save.
     * @param heroDetails the heroDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated heroDetails,
     * or with status {@code 400 (Bad Request)} if the heroDetails is not valid,
     * or with status {@code 404 (Not Found)} if the heroDetails is not found,
     * or with status {@code 500 (Internal Server Error)} if the heroDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/hero-details/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<HeroDetails> partialUpdateHeroDetails(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody HeroDetails heroDetails
    ) throws URISyntaxException {
        log.debug("REST request to partial update HeroDetails partially : {}, {}", id, heroDetails);
        if (heroDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, heroDetails.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!heroDetailsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<HeroDetails> result = heroDetailsRepository
            .findById(heroDetails.getId())
            .map(existingHeroDetails -> {
                if (heroDetails.getPhone() != null) {
                    existingHeroDetails.setPhone(heroDetails.getPhone());
                }
                if (heroDetails.getDateOfBirth() != null) {
                    existingHeroDetails.setDateOfBirth(heroDetails.getDateOfBirth());
                }
                if (heroDetails.getStreetAddress() != null) {
                    existingHeroDetails.setStreetAddress(heroDetails.getStreetAddress());
                }
                if (heroDetails.getCity() != null) {
                    existingHeroDetails.setCity(heroDetails.getCity());
                }
                if (heroDetails.getStateProvince() != null) {
                    existingHeroDetails.setStateProvince(heroDetails.getStateProvince());
                }
                if (heroDetails.getPostalCode() != null) {
                    existingHeroDetails.setPostalCode(heroDetails.getPostalCode());
                }

                return existingHeroDetails;
            })
            .map(heroDetailsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, heroDetails.getId().toString())
        );
    }

    /**
     * {@code GET  /hero-details} : get all the heroDetails.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of heroDetails in body.
     */
    @GetMapping("/hero-details")
    public List<HeroDetails> getAllHeroDetails(@RequestParam(required = false) String filter) {
        if ("herokeys-is-null".equals(filter)) {
            log.debug("REST request to get all HeroDetailss where heroKeys is null");
            return StreamSupport
                .stream(heroDetailsRepository.findAll().spliterator(), false)
                .filter(heroDetails -> heroDetails.getHeroKeys() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all HeroDetails");
        return heroDetailsRepository.findAll();
    }

    /**
     * {@code GET  /hero-details/:id} : get the "id" heroDetails.
     *
     * @param id the id of the heroDetails to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the heroDetails, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/hero-details/{id}")
    public ResponseEntity<HeroDetails> getHeroDetails(@PathVariable Long id) {
        log.debug("REST request to get HeroDetails : {}", id);
        Optional<HeroDetails> heroDetails = heroDetailsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(heroDetails);
    }

    /**
     * {@code DELETE  /hero-details/:id} : delete the "id" heroDetails.
     *
     * @param id the id of the heroDetails to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/hero-details/{id}")
    public ResponseEntity<Void> deleteHeroDetails(@PathVariable Long id) {
        log.debug("REST request to delete HeroDetails : {}", id);
        heroDetailsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
