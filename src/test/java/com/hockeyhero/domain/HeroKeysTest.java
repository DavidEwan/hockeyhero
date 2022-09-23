package com.hockeyhero.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.hockeyhero.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class HeroKeysTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(HeroKeys.class);
        HeroKeys heroKeys1 = new HeroKeys();
        heroKeys1.setId(1L);
        HeroKeys heroKeys2 = new HeroKeys();
        heroKeys2.setId(heroKeys1.getId());
        assertThat(heroKeys1).isEqualTo(heroKeys2);
        heroKeys2.setId(2L);
        assertThat(heroKeys1).isNotEqualTo(heroKeys2);
        heroKeys1.setId(null);
        assertThat(heroKeys1).isNotEqualTo(heroKeys2);
    }
}
