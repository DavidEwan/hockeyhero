package com.hockeyhero.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.hockeyhero.IntegrationTest;
import com.hockeyhero.domain.HeroKeys;
import com.hockeyhero.repository.HeroKeysRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link HeroKeysResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class HeroKeysResourceIT {

    private static final Boolean DEFAULT_HIDE_ME = false;
    private static final Boolean UPDATED_HIDE_ME = true;

    private static final Double DEFAULT_LATITUDE = 1D;
    private static final Double UPDATED_LATITUDE = 2D;

    private static final Double DEFAULT_LONGITUDE = 1D;
    private static final Double UPDATED_LONGITUDE = 2D;

    private static final Integer DEFAULT_AGE = 1;
    private static final Integer UPDATED_AGE = 2;

    private static final Integer DEFAULT_MY_POSITION = 1;
    private static final Integer UPDATED_MY_POSITION = 2;

    private static final Integer DEFAULT_SKILL = 1;
    private static final Integer UPDATED_SKILL = 2;

    private static final String ENTITY_API_URL = "/api/hero-keys";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private HeroKeysRepository heroKeysRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restHeroKeysMockMvc;

    private HeroKeys heroKeys;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static HeroKeys createEntity(EntityManager em) {
        HeroKeys heroKeys = new HeroKeys()
            .hideMe(DEFAULT_HIDE_ME)
            .latitude(DEFAULT_LATITUDE)
            .longitude(DEFAULT_LONGITUDE)
            .age(DEFAULT_AGE)
            .myPosition(DEFAULT_MY_POSITION)
            .skill(DEFAULT_SKILL);
        return heroKeys;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static HeroKeys createUpdatedEntity(EntityManager em) {
        HeroKeys heroKeys = new HeroKeys()
            .hideMe(UPDATED_HIDE_ME)
            .latitude(UPDATED_LATITUDE)
            .longitude(UPDATED_LONGITUDE)
            .age(UPDATED_AGE)
            .myPosition(UPDATED_MY_POSITION)
            .skill(UPDATED_SKILL);
        return heroKeys;
    }

    @BeforeEach
    public void initTest() {
        heroKeys = createEntity(em);
    }

    @Test
    @Transactional
    void createHeroKeys() throws Exception {
        int databaseSizeBeforeCreate = heroKeysRepository.findAll().size();
        // Create the HeroKeys
        restHeroKeysMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(heroKeys)))
            .andExpect(status().isCreated());

        // Validate the HeroKeys in the database
        List<HeroKeys> heroKeysList = heroKeysRepository.findAll();
        assertThat(heroKeysList).hasSize(databaseSizeBeforeCreate + 1);
        HeroKeys testHeroKeys = heroKeysList.get(heroKeysList.size() - 1);
        assertThat(testHeroKeys.getHideMe()).isEqualTo(DEFAULT_HIDE_ME);
        assertThat(testHeroKeys.getLatitude()).isEqualTo(DEFAULT_LATITUDE);
        assertThat(testHeroKeys.getLongitude()).isEqualTo(DEFAULT_LONGITUDE);
        assertThat(testHeroKeys.getAge()).isEqualTo(DEFAULT_AGE);
        assertThat(testHeroKeys.getMyPosition()).isEqualTo(DEFAULT_MY_POSITION);
        assertThat(testHeroKeys.getSkill()).isEqualTo(DEFAULT_SKILL);
    }

    @Test
    @Transactional
    void createHeroKeysWithExistingId() throws Exception {
        // Create the HeroKeys with an existing ID
        heroKeys.setId(1L);

        int databaseSizeBeforeCreate = heroKeysRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restHeroKeysMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(heroKeys)))
            .andExpect(status().isBadRequest());

        // Validate the HeroKeys in the database
        List<HeroKeys> heroKeysList = heroKeysRepository.findAll();
        assertThat(heroKeysList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllHeroKeys() throws Exception {
        // Initialize the database
        heroKeysRepository.saveAndFlush(heroKeys);

        // Get all the heroKeysList
        restHeroKeysMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(heroKeys.getId().intValue())))
            .andExpect(jsonPath("$.[*].hideMe").value(hasItem(DEFAULT_HIDE_ME.booleanValue())))
            .andExpect(jsonPath("$.[*].latitude").value(hasItem(DEFAULT_LATITUDE.doubleValue())))
            .andExpect(jsonPath("$.[*].longitude").value(hasItem(DEFAULT_LONGITUDE.doubleValue())))
            .andExpect(jsonPath("$.[*].age").value(hasItem(DEFAULT_AGE)))
            .andExpect(jsonPath("$.[*].myPosition").value(hasItem(DEFAULT_MY_POSITION)))
            .andExpect(jsonPath("$.[*].skill").value(hasItem(DEFAULT_SKILL)));
    }

    @Test
    @Transactional
    void getHeroKeys() throws Exception {
        // Initialize the database
        heroKeysRepository.saveAndFlush(heroKeys);

        // Get the heroKeys
        restHeroKeysMockMvc
            .perform(get(ENTITY_API_URL_ID, heroKeys.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(heroKeys.getId().intValue()))
            .andExpect(jsonPath("$.hideMe").value(DEFAULT_HIDE_ME.booleanValue()))
            .andExpect(jsonPath("$.latitude").value(DEFAULT_LATITUDE.doubleValue()))
            .andExpect(jsonPath("$.longitude").value(DEFAULT_LONGITUDE.doubleValue()))
            .andExpect(jsonPath("$.age").value(DEFAULT_AGE))
            .andExpect(jsonPath("$.myPosition").value(DEFAULT_MY_POSITION))
            .andExpect(jsonPath("$.skill").value(DEFAULT_SKILL));
    }

    @Test
    @Transactional
    void getNonExistingHeroKeys() throws Exception {
        // Get the heroKeys
        restHeroKeysMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingHeroKeys() throws Exception {
        // Initialize the database
        heroKeysRepository.saveAndFlush(heroKeys);

        int databaseSizeBeforeUpdate = heroKeysRepository.findAll().size();

        // Update the heroKeys
        HeroKeys updatedHeroKeys = heroKeysRepository.findById(heroKeys.getId()).get();
        // Disconnect from session so that the updates on updatedHeroKeys are not directly saved in db
        em.detach(updatedHeroKeys);
        updatedHeroKeys
            .hideMe(UPDATED_HIDE_ME)
            .latitude(UPDATED_LATITUDE)
            .longitude(UPDATED_LONGITUDE)
            .age(UPDATED_AGE)
            .myPosition(UPDATED_MY_POSITION)
            .skill(UPDATED_SKILL);

        restHeroKeysMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedHeroKeys.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedHeroKeys))
            )
            .andExpect(status().isOk());

        // Validate the HeroKeys in the database
        List<HeroKeys> heroKeysList = heroKeysRepository.findAll();
        assertThat(heroKeysList).hasSize(databaseSizeBeforeUpdate);
        HeroKeys testHeroKeys = heroKeysList.get(heroKeysList.size() - 1);
        assertThat(testHeroKeys.getHideMe()).isEqualTo(UPDATED_HIDE_ME);
        assertThat(testHeroKeys.getLatitude()).isEqualTo(UPDATED_LATITUDE);
        assertThat(testHeroKeys.getLongitude()).isEqualTo(UPDATED_LONGITUDE);
        assertThat(testHeroKeys.getAge()).isEqualTo(UPDATED_AGE);
        assertThat(testHeroKeys.getMyPosition()).isEqualTo(UPDATED_MY_POSITION);
        assertThat(testHeroKeys.getSkill()).isEqualTo(UPDATED_SKILL);
    }

    @Test
    @Transactional
    void putNonExistingHeroKeys() throws Exception {
        int databaseSizeBeforeUpdate = heroKeysRepository.findAll().size();
        heroKeys.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHeroKeysMockMvc
            .perform(
                put(ENTITY_API_URL_ID, heroKeys.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(heroKeys))
            )
            .andExpect(status().isBadRequest());

        // Validate the HeroKeys in the database
        List<HeroKeys> heroKeysList = heroKeysRepository.findAll();
        assertThat(heroKeysList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchHeroKeys() throws Exception {
        int databaseSizeBeforeUpdate = heroKeysRepository.findAll().size();
        heroKeys.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHeroKeysMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(heroKeys))
            )
            .andExpect(status().isBadRequest());

        // Validate the HeroKeys in the database
        List<HeroKeys> heroKeysList = heroKeysRepository.findAll();
        assertThat(heroKeysList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamHeroKeys() throws Exception {
        int databaseSizeBeforeUpdate = heroKeysRepository.findAll().size();
        heroKeys.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHeroKeysMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(heroKeys)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the HeroKeys in the database
        List<HeroKeys> heroKeysList = heroKeysRepository.findAll();
        assertThat(heroKeysList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateHeroKeysWithPatch() throws Exception {
        // Initialize the database
        heroKeysRepository.saveAndFlush(heroKeys);

        int databaseSizeBeforeUpdate = heroKeysRepository.findAll().size();

        // Update the heroKeys using partial update
        HeroKeys partialUpdatedHeroKeys = new HeroKeys();
        partialUpdatedHeroKeys.setId(heroKeys.getId());

        partialUpdatedHeroKeys.hideMe(UPDATED_HIDE_ME).latitude(UPDATED_LATITUDE).longitude(UPDATED_LONGITUDE).age(UPDATED_AGE);

        restHeroKeysMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHeroKeys.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHeroKeys))
            )
            .andExpect(status().isOk());

        // Validate the HeroKeys in the database
        List<HeroKeys> heroKeysList = heroKeysRepository.findAll();
        assertThat(heroKeysList).hasSize(databaseSizeBeforeUpdate);
        HeroKeys testHeroKeys = heroKeysList.get(heroKeysList.size() - 1);
        assertThat(testHeroKeys.getHideMe()).isEqualTo(UPDATED_HIDE_ME);
        assertThat(testHeroKeys.getLatitude()).isEqualTo(UPDATED_LATITUDE);
        assertThat(testHeroKeys.getLongitude()).isEqualTo(UPDATED_LONGITUDE);
        assertThat(testHeroKeys.getAge()).isEqualTo(UPDATED_AGE);
        assertThat(testHeroKeys.getMyPosition()).isEqualTo(DEFAULT_MY_POSITION);
        assertThat(testHeroKeys.getSkill()).isEqualTo(DEFAULT_SKILL);
    }

    @Test
    @Transactional
    void fullUpdateHeroKeysWithPatch() throws Exception {
        // Initialize the database
        heroKeysRepository.saveAndFlush(heroKeys);

        int databaseSizeBeforeUpdate = heroKeysRepository.findAll().size();

        // Update the heroKeys using partial update
        HeroKeys partialUpdatedHeroKeys = new HeroKeys();
        partialUpdatedHeroKeys.setId(heroKeys.getId());

        partialUpdatedHeroKeys
            .hideMe(UPDATED_HIDE_ME)
            .latitude(UPDATED_LATITUDE)
            .longitude(UPDATED_LONGITUDE)
            .age(UPDATED_AGE)
            .myPosition(UPDATED_MY_POSITION)
            .skill(UPDATED_SKILL);

        restHeroKeysMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHeroKeys.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHeroKeys))
            )
            .andExpect(status().isOk());

        // Validate the HeroKeys in the database
        List<HeroKeys> heroKeysList = heroKeysRepository.findAll();
        assertThat(heroKeysList).hasSize(databaseSizeBeforeUpdate);
        HeroKeys testHeroKeys = heroKeysList.get(heroKeysList.size() - 1);
        assertThat(testHeroKeys.getHideMe()).isEqualTo(UPDATED_HIDE_ME);
        assertThat(testHeroKeys.getLatitude()).isEqualTo(UPDATED_LATITUDE);
        assertThat(testHeroKeys.getLongitude()).isEqualTo(UPDATED_LONGITUDE);
        assertThat(testHeroKeys.getAge()).isEqualTo(UPDATED_AGE);
        assertThat(testHeroKeys.getMyPosition()).isEqualTo(UPDATED_MY_POSITION);
        assertThat(testHeroKeys.getSkill()).isEqualTo(UPDATED_SKILL);
    }

    @Test
    @Transactional
    void patchNonExistingHeroKeys() throws Exception {
        int databaseSizeBeforeUpdate = heroKeysRepository.findAll().size();
        heroKeys.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHeroKeysMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, heroKeys.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(heroKeys))
            )
            .andExpect(status().isBadRequest());

        // Validate the HeroKeys in the database
        List<HeroKeys> heroKeysList = heroKeysRepository.findAll();
        assertThat(heroKeysList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchHeroKeys() throws Exception {
        int databaseSizeBeforeUpdate = heroKeysRepository.findAll().size();
        heroKeys.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHeroKeysMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(heroKeys))
            )
            .andExpect(status().isBadRequest());

        // Validate the HeroKeys in the database
        List<HeroKeys> heroKeysList = heroKeysRepository.findAll();
        assertThat(heroKeysList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamHeroKeys() throws Exception {
        int databaseSizeBeforeUpdate = heroKeysRepository.findAll().size();
        heroKeys.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHeroKeysMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(heroKeys)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the HeroKeys in the database
        List<HeroKeys> heroKeysList = heroKeysRepository.findAll();
        assertThat(heroKeysList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteHeroKeys() throws Exception {
        // Initialize the database
        heroKeysRepository.saveAndFlush(heroKeys);

        int databaseSizeBeforeDelete = heroKeysRepository.findAll().size();

        // Delete the heroKeys
        restHeroKeysMockMvc
            .perform(delete(ENTITY_API_URL_ID, heroKeys.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<HeroKeys> heroKeysList = heroKeysRepository.findAll();
        assertThat(heroKeysList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
