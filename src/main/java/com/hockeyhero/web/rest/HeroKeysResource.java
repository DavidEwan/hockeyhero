package com.hockeyhero.web.rest;

import com.hockeyhero.domain.HeroKeys;
import com.hockeyhero.repository.HeroKeysRepository;
import com.hockeyhero.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.hockeyhero.domain.HeroKeys}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class HeroKeysResource {

    private final Logger log = LoggerFactory.getLogger(HeroKeysResource.class);

    private static final String ENTITY_NAME = "heroKeys";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HeroKeysRepository heroKeysRepository;

    public HeroKeysResource(HeroKeysRepository heroKeysRepository) {
        this.heroKeysRepository = heroKeysRepository;
    }

    /**
     * {@code POST  /hero-keys} : Create a new heroKeys.
     *
     * @param heroKeys the heroKeys to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new heroKeys, or with status {@code 400 (Bad Request)} if the heroKeys has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/hero-keys")
    public ResponseEntity<HeroKeys> createHeroKeys(@RequestBody HeroKeys heroKeys) throws URISyntaxException {
        log.debug("REST request to save HeroKeys : {}", heroKeys);
        if (heroKeys.getId() != null) {
            throw new BadRequestAlertException("A new heroKeys cannot already have an ID", ENTITY_NAME, "idexists");
        }
        HeroKeys result = heroKeysRepository.save(heroKeys);
        return ResponseEntity
            .created(new URI("/api/hero-keys/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /hero-keys/:id} : Updates an existing heroKeys.
     *
     * @param id the id of the heroKeys to save.
     * @param heroKeys the heroKeys to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated heroKeys,
     * or with status {@code 400 (Bad Request)} if the heroKeys is not valid,
     * or with status {@code 500 (Internal Server Error)} if the heroKeys couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/hero-keys/{id}")
    public ResponseEntity<HeroKeys> updateHeroKeys(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody HeroKeys heroKeys
    ) throws URISyntaxException {
        log.debug("REST request to update HeroKeys : {}, {}", id, heroKeys);
        if (heroKeys.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, heroKeys.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!heroKeysRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        HeroKeys result = heroKeysRepository.save(heroKeys);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, heroKeys.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /hero-keys/:id} : Partial updates given fields of an existing heroKeys, field will ignore if it is null
     *
     * @param id the id of the heroKeys to save.
     * @param heroKeys the heroKeys to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated heroKeys,
     * or with status {@code 400 (Bad Request)} if the heroKeys is not valid,
     * or with status {@code 404 (Not Found)} if the heroKeys is not found,
     * or with status {@code 500 (Internal Server Error)} if the heroKeys couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/hero-keys/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<HeroKeys> partialUpdateHeroKeys(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody HeroKeys heroKeys
    ) throws URISyntaxException {
        log.debug("REST request to partial update HeroKeys partially : {}, {}", id, heroKeys);
        if (heroKeys.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, heroKeys.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!heroKeysRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<HeroKeys> result = heroKeysRepository
            .findById(heroKeys.getId())
            .map(existingHeroKeys -> {
                if (heroKeys.getHideMe() != null) {
                    existingHeroKeys.setHideMe(heroKeys.getHideMe());
                }
                if (heroKeys.getLatitude() != null) {
                    existingHeroKeys.setLatitude(heroKeys.getLatitude());
                }
                if (heroKeys.getLongitude() != null) {
                    existingHeroKeys.setLongitude(heroKeys.getLongitude());
                }
                if (heroKeys.getAge() != null) {
                    existingHeroKeys.setAge(heroKeys.getAge());
                }
                if (heroKeys.getMyPosition() != null) {
                    existingHeroKeys.setMyPosition(heroKeys.getMyPosition());
                }
                if (heroKeys.getSkill() != null) {
                    existingHeroKeys.setSkill(heroKeys.getSkill());
                }

                return existingHeroKeys;
            })
            .map(heroKeysRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, heroKeys.getId().toString())
        );
    }

    /**
     * {@code GET  /hero-keys} : get all the heroKeys.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of heroKeys in body.
     */
    @GetMapping("/hero-keys")
    public List<HeroKeys> getAllHeroKeys() {
        log.debug("REST request to get all HeroKeys");
        return heroKeysRepository.findAll();
    }

    /**
     * {@code GET  /hero-keys/:id} : get the "id" heroKeys.
     *
     * @param id the id of the heroKeys to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the heroKeys, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/hero-keys/{id}")
    public ResponseEntity<HeroKeys> getHeroKeys(@PathVariable Long id) {
        log.debug("REST request to get HeroKeys : {}", id);
        Optional<HeroKeys> heroKeys = heroKeysRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(heroKeys);
    }

    /**
     * {@code DELETE  /hero-keys/:id} : delete the "id" heroKeys.
     *
     * @param id the id of the heroKeys to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/hero-keys/{id}")
    public ResponseEntity<Void> deleteHeroKeys(@PathVariable Long id) {
        log.debug("REST request to delete HeroKeys : {}", id);
        heroKeysRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
