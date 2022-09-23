package com.hockeyhero.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.hockeyhero.IntegrationTest;
import com.hockeyhero.domain.HeroDetails;
import com.hockeyhero.repository.HeroDetailsRepository;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link HeroDetailsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class HeroDetailsResourceIT {

    private static final String DEFAULT_PHONE = "AAAAAAAAAA";
    private static final String UPDATED_PHONE = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE_OF_BIRTH = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_OF_BIRTH = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_STREET_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_STREET_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_CITY = "AAAAAAAAAA";
    private static final String UPDATED_CITY = "BBBBBBBBBB";

    private static final String DEFAULT_STATE_PROVINCE = "AAAAAAAAAA";
    private static final String UPDATED_STATE_PROVINCE = "BBBBBBBBBB";

    private static final String DEFAULT_POSTAL_CODE = "AAAAAAAAAA";
    private static final String UPDATED_POSTAL_CODE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/hero-details";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private HeroDetailsRepository heroDetailsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restHeroDetailsMockMvc;

    private HeroDetails heroDetails;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static HeroDetails createEntity(EntityManager em) {
        HeroDetails heroDetails = new HeroDetails()
            .phone(DEFAULT_PHONE)
            .dateOfBirth(DEFAULT_DATE_OF_BIRTH)
            .streetAddress(DEFAULT_STREET_ADDRESS)
            .city(DEFAULT_CITY)
            .stateProvince(DEFAULT_STATE_PROVINCE)
            .postalCode(DEFAULT_POSTAL_CODE);
        return heroDetails;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static HeroDetails createUpdatedEntity(EntityManager em) {
        HeroDetails heroDetails = new HeroDetails()
            .phone(UPDATED_PHONE)
            .dateOfBirth(UPDATED_DATE_OF_BIRTH)
            .streetAddress(UPDATED_STREET_ADDRESS)
            .city(UPDATED_CITY)
            .stateProvince(UPDATED_STATE_PROVINCE)
            .postalCode(UPDATED_POSTAL_CODE);
        return heroDetails;
    }

    @BeforeEach
    public void initTest() {
        heroDetails = createEntity(em);
    }

    @Test
    @Transactional
    void createHeroDetails() throws Exception {
        int databaseSizeBeforeCreate = heroDetailsRepository.findAll().size();
        // Create the HeroDetails
        restHeroDetailsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(heroDetails)))
            .andExpect(status().isCreated());

        // Validate the HeroDetails in the database
        List<HeroDetails> heroDetailsList = heroDetailsRepository.findAll();
        assertThat(heroDetailsList).hasSize(databaseSizeBeforeCreate + 1);
        HeroDetails testHeroDetails = heroDetailsList.get(heroDetailsList.size() - 1);
        assertThat(testHeroDetails.getPhone()).isEqualTo(DEFAULT_PHONE);
        assertThat(testHeroDetails.getDateOfBirth()).isEqualTo(DEFAULT_DATE_OF_BIRTH);
        assertThat(testHeroDetails.getStreetAddress()).isEqualTo(DEFAULT_STREET_ADDRESS);
        assertThat(testHeroDetails.getCity()).isEqualTo(DEFAULT_CITY);
        assertThat(testHeroDetails.getStateProvince()).isEqualTo(DEFAULT_STATE_PROVINCE);
        assertThat(testHeroDetails.getPostalCode()).isEqualTo(DEFAULT_POSTAL_CODE);
    }

    @Test
    @Transactional
    void createHeroDetailsWithExistingId() throws Exception {
        // Create the HeroDetails with an existing ID
        heroDetails.setId(1L);

        int databaseSizeBeforeCreate = heroDetailsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restHeroDetailsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(heroDetails)))
            .andExpect(status().isBadRequest());

        // Validate the HeroDetails in the database
        List<HeroDetails> heroDetailsList = heroDetailsRepository.findAll();
        assertThat(heroDetailsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllHeroDetails() throws Exception {
        // Initialize the database
        heroDetailsRepository.saveAndFlush(heroDetails);

        // Get all the heroDetailsList
        restHeroDetailsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(heroDetails.getId().intValue())))
            .andExpect(jsonPath("$.[*].phone").value(hasItem(DEFAULT_PHONE)))
            .andExpect(jsonPath("$.[*].dateOfBirth").value(hasItem(DEFAULT_DATE_OF_BIRTH.toString())))
            .andExpect(jsonPath("$.[*].streetAddress").value(hasItem(DEFAULT_STREET_ADDRESS)))
            .andExpect(jsonPath("$.[*].city").value(hasItem(DEFAULT_CITY)))
            .andExpect(jsonPath("$.[*].stateProvince").value(hasItem(DEFAULT_STATE_PROVINCE)))
            .andExpect(jsonPath("$.[*].postalCode").value(hasItem(DEFAULT_POSTAL_CODE)));
    }

    @Test
    @Transactional
    void getHeroDetails() throws Exception {
        // Initialize the database
        heroDetailsRepository.saveAndFlush(heroDetails);

        // Get the heroDetails
        restHeroDetailsMockMvc
            .perform(get(ENTITY_API_URL_ID, heroDetails.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(heroDetails.getId().intValue()))
            .andExpect(jsonPath("$.phone").value(DEFAULT_PHONE))
            .andExpect(jsonPath("$.dateOfBirth").value(DEFAULT_DATE_OF_BIRTH.toString()))
            .andExpect(jsonPath("$.streetAddress").value(DEFAULT_STREET_ADDRESS))
            .andExpect(jsonPath("$.city").value(DEFAULT_CITY))
            .andExpect(jsonPath("$.stateProvince").value(DEFAULT_STATE_PROVINCE))
            .andExpect(jsonPath("$.postalCode").value(DEFAULT_POSTAL_CODE));
    }

    @Test
    @Transactional
    void getNonExistingHeroDetails() throws Exception {
        // Get the heroDetails
        restHeroDetailsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingHeroDetails() throws Exception {
        // Initialize the database
        heroDetailsRepository.saveAndFlush(heroDetails);

        int databaseSizeBeforeUpdate = heroDetailsRepository.findAll().size();

        // Update the heroDetails
        HeroDetails updatedHeroDetails = heroDetailsRepository.findById(heroDetails.getId()).get();
        // Disconnect from session so that the updates on updatedHeroDetails are not directly saved in db
        em.detach(updatedHeroDetails);
        updatedHeroDetails
            .phone(UPDATED_PHONE)
            .dateOfBirth(UPDATED_DATE_OF_BIRTH)
            .streetAddress(UPDATED_STREET_ADDRESS)
            .city(UPDATED_CITY)
            .stateProvince(UPDATED_STATE_PROVINCE)
            .postalCode(UPDATED_POSTAL_CODE);

        restHeroDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedHeroDetails.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedHeroDetails))
            )
            .andExpect(status().isOk());

        // Validate the HeroDetails in the database
        List<HeroDetails> heroDetailsList = heroDetailsRepository.findAll();
        assertThat(heroDetailsList).hasSize(databaseSizeBeforeUpdate);
        HeroDetails testHeroDetails = heroDetailsList.get(heroDetailsList.size() - 1);
        assertThat(testHeroDetails.getPhone()).isEqualTo(UPDATED_PHONE);
        assertThat(testHeroDetails.getDateOfBirth()).isEqualTo(UPDATED_DATE_OF_BIRTH);
        assertThat(testHeroDetails.getStreetAddress()).isEqualTo(UPDATED_STREET_ADDRESS);
        assertThat(testHeroDetails.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testHeroDetails.getStateProvince()).isEqualTo(UPDATED_STATE_PROVINCE);
        assertThat(testHeroDetails.getPostalCode()).isEqualTo(UPDATED_POSTAL_CODE);
    }

    @Test
    @Transactional
    void putNonExistingHeroDetails() throws Exception {
        int databaseSizeBeforeUpdate = heroDetailsRepository.findAll().size();
        heroDetails.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHeroDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, heroDetails.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(heroDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the HeroDetails in the database
        List<HeroDetails> heroDetailsList = heroDetailsRepository.findAll();
        assertThat(heroDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchHeroDetails() throws Exception {
        int databaseSizeBeforeUpdate = heroDetailsRepository.findAll().size();
        heroDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHeroDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(heroDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the HeroDetails in the database
        List<HeroDetails> heroDetailsList = heroDetailsRepository.findAll();
        assertThat(heroDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamHeroDetails() throws Exception {
        int databaseSizeBeforeUpdate = heroDetailsRepository.findAll().size();
        heroDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHeroDetailsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(heroDetails)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the HeroDetails in the database
        List<HeroDetails> heroDetailsList = heroDetailsRepository.findAll();
        assertThat(heroDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateHeroDetailsWithPatch() throws Exception {
        // Initialize the database
        heroDetailsRepository.saveAndFlush(heroDetails);

        int databaseSizeBeforeUpdate = heroDetailsRepository.findAll().size();

        // Update the heroDetails using partial update
        HeroDetails partialUpdatedHeroDetails = new HeroDetails();
        partialUpdatedHeroDetails.setId(heroDetails.getId());

        partialUpdatedHeroDetails.phone(UPDATED_PHONE).dateOfBirth(UPDATED_DATE_OF_BIRTH);

        restHeroDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHeroDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHeroDetails))
            )
            .andExpect(status().isOk());

        // Validate the HeroDetails in the database
        List<HeroDetails> heroDetailsList = heroDetailsRepository.findAll();
        assertThat(heroDetailsList).hasSize(databaseSizeBeforeUpdate);
        HeroDetails testHeroDetails = heroDetailsList.get(heroDetailsList.size() - 1);
        assertThat(testHeroDetails.getPhone()).isEqualTo(UPDATED_PHONE);
        assertThat(testHeroDetails.getDateOfBirth()).isEqualTo(UPDATED_DATE_OF_BIRTH);
        assertThat(testHeroDetails.getStreetAddress()).isEqualTo(DEFAULT_STREET_ADDRESS);
        assertThat(testHeroDetails.getCity()).isEqualTo(DEFAULT_CITY);
        assertThat(testHeroDetails.getStateProvince()).isEqualTo(DEFAULT_STATE_PROVINCE);
        assertThat(testHeroDetails.getPostalCode()).isEqualTo(DEFAULT_POSTAL_CODE);
    }

    @Test
    @Transactional
    void fullUpdateHeroDetailsWithPatch() throws Exception {
        // Initialize the database
        heroDetailsRepository.saveAndFlush(heroDetails);

        int databaseSizeBeforeUpdate = heroDetailsRepository.findAll().size();

        // Update the heroDetails using partial update
        HeroDetails partialUpdatedHeroDetails = new HeroDetails();
        partialUpdatedHeroDetails.setId(heroDetails.getId());

        partialUpdatedHeroDetails
            .phone(UPDATED_PHONE)
            .dateOfBirth(UPDATED_DATE_OF_BIRTH)
            .streetAddress(UPDATED_STREET_ADDRESS)
            .city(UPDATED_CITY)
            .stateProvince(UPDATED_STATE_PROVINCE)
            .postalCode(UPDATED_POSTAL_CODE);

        restHeroDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHeroDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHeroDetails))
            )
            .andExpect(status().isOk());

        // Validate the HeroDetails in the database
        List<HeroDetails> heroDetailsList = heroDetailsRepository.findAll();
        assertThat(heroDetailsList).hasSize(databaseSizeBeforeUpdate);
        HeroDetails testHeroDetails = heroDetailsList.get(heroDetailsList.size() - 1);
        assertThat(testHeroDetails.getPhone()).isEqualTo(UPDATED_PHONE);
        assertThat(testHeroDetails.getDateOfBirth()).isEqualTo(UPDATED_DATE_OF_BIRTH);
        assertThat(testHeroDetails.getStreetAddress()).isEqualTo(UPDATED_STREET_ADDRESS);
        assertThat(testHeroDetails.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testHeroDetails.getStateProvince()).isEqualTo(UPDATED_STATE_PROVINCE);
        assertThat(testHeroDetails.getPostalCode()).isEqualTo(UPDATED_POSTAL_CODE);
    }

    @Test
    @Transactional
    void patchNonExistingHeroDetails() throws Exception {
        int databaseSizeBeforeUpdate = heroDetailsRepository.findAll().size();
        heroDetails.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHeroDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, heroDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(heroDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the HeroDetails in the database
        List<HeroDetails> heroDetailsList = heroDetailsRepository.findAll();
        assertThat(heroDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchHeroDetails() throws Exception {
        int databaseSizeBeforeUpdate = heroDetailsRepository.findAll().size();
        heroDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHeroDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(heroDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the HeroDetails in the database
        List<HeroDetails> heroDetailsList = heroDetailsRepository.findAll();
        assertThat(heroDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamHeroDetails() throws Exception {
        int databaseSizeBeforeUpdate = heroDetailsRepository.findAll().size();
        heroDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHeroDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(heroDetails))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the HeroDetails in the database
        List<HeroDetails> heroDetailsList = heroDetailsRepository.findAll();
        assertThat(heroDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteHeroDetails() throws Exception {
        // Initialize the database
        heroDetailsRepository.saveAndFlush(heroDetails);

        int databaseSizeBeforeDelete = heroDetailsRepository.findAll().size();

        // Delete the heroDetails
        restHeroDetailsMockMvc
            .perform(delete(ENTITY_API_URL_ID, heroDetails.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<HeroDetails> heroDetailsList = heroDetailsRepository.findAll();
        assertThat(heroDetailsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
