package com.hockeyhero.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.hockeyhero.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class HeroDetailsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(HeroDetails.class);
        HeroDetails heroDetails1 = new HeroDetails();
        heroDetails1.setId(1L);
        HeroDetails heroDetails2 = new HeroDetails();
        heroDetails2.setId(heroDetails1.getId());
        assertThat(heroDetails1).isEqualTo(heroDetails2);
        heroDetails2.setId(2L);
        assertThat(heroDetails1).isNotEqualTo(heroDetails2);
        heroDetails1.setId(null);
        assertThat(heroDetails1).isNotEqualTo(heroDetails2);
    }
}
