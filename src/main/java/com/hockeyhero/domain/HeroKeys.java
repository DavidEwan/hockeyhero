package com.hockeyhero.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A HeroKeys.
 */
@Entity
@Table(name = "hero_keys")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class HeroKeys implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "hide_me")
    private Boolean hideMe;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "age")
    private Integer age;

    @Column(name = "my_position")
    private Integer myPosition;

    @Column(name = "skill")
    private Integer skill;

    @JsonIgnoreProperties(value = { "user", "heroKeys" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private HeroDetails heroDetails;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public HeroKeys id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getHideMe() {
        return this.hideMe;
    }

    public HeroKeys hideMe(Boolean hideMe) {
        this.setHideMe(hideMe);
        return this;
    }

    public void setHideMe(Boolean hideMe) {
        this.hideMe = hideMe;
    }

    public Double getLatitude() {
        return this.latitude;
    }

    public HeroKeys latitude(Double latitude) {
        this.setLatitude(latitude);
        return this;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return this.longitude;
    }

    public HeroKeys longitude(Double longitude) {
        this.setLongitude(longitude);
        return this;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Integer getAge() {
        return this.age;
    }

    public HeroKeys age(Integer age) {
        this.setAge(age);
        return this;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Integer getMyPosition() {
        return this.myPosition;
    }

    public HeroKeys myPosition(Integer myPosition) {
        this.setMyPosition(myPosition);
        return this;
    }

    public void setMyPosition(Integer myPosition) {
        this.myPosition = myPosition;
    }

    public Integer getSkill() {
        return this.skill;
    }

    public HeroKeys skill(Integer skill) {
        this.setSkill(skill);
        return this;
    }

    public void setSkill(Integer skill) {
        this.skill = skill;
    }

    public HeroDetails getHeroDetails() {
        return this.heroDetails;
    }

    public void setHeroDetails(HeroDetails heroDetails) {
        this.heroDetails = heroDetails;
    }

    public HeroKeys heroDetails(HeroDetails heroDetails) {
        this.setHeroDetails(heroDetails);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof HeroKeys)) {
            return false;
        }
        return id != null && id.equals(((HeroKeys) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "HeroKeys{" +
            "id=" + getId() +
            ", hideMe='" + getHideMe() + "'" +
            ", latitude=" + getLatitude() +
            ", longitude=" + getLongitude() +
            ", age=" + getAge() +
            ", myPosition=" + getMyPosition() +
            ", skill=" + getSkill() +
            "}";
    }
}
