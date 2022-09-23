import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('HeroDetails e2e test', () => {
  const heroDetailsPageUrl = '/hero-details';
  const heroDetailsPageUrlPattern = new RegExp('/hero-details(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const heroDetailsSample = {};

  let heroDetails;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/hero-details+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/hero-details').as('postEntityRequest');
    cy.intercept('DELETE', '/api/hero-details/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (heroDetails) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/hero-details/${heroDetails.id}`,
      }).then(() => {
        heroDetails = undefined;
      });
    }
  });

  it('HeroDetails menu should load HeroDetails page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('hero-details');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('HeroDetails').should('exist');
    cy.url().should('match', heroDetailsPageUrlPattern);
  });

  describe('HeroDetails page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(heroDetailsPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create HeroDetails page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/hero-details/new$'));
        cy.getEntityCreateUpdateHeading('HeroDetails');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', heroDetailsPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/hero-details',
          body: heroDetailsSample,
        }).then(({ body }) => {
          heroDetails = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/hero-details+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [heroDetails],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(heroDetailsPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details HeroDetails page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('heroDetails');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', heroDetailsPageUrlPattern);
      });

      it('edit button click should load edit HeroDetails page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('HeroDetails');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', heroDetailsPageUrlPattern);
      });

      it('edit button click should load edit HeroDetails page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('HeroDetails');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', heroDetailsPageUrlPattern);
      });

      it('last delete button click should delete instance of HeroDetails', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('heroDetails').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', heroDetailsPageUrlPattern);

        heroDetails = undefined;
      });
    });
  });

  describe('new HeroDetails page', () => {
    beforeEach(() => {
      cy.visit(`${heroDetailsPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('HeroDetails');
    });

    it('should create an instance of HeroDetails', () => {
      cy.get(`[data-cy="phone"]`).type('1-655-323-4606 x4290').should('have.value', '1-655-323-4606 x4290');

      cy.get(`[data-cy="dateOfBirth"]`).type('2022-09-21').blur().should('have.value', '2022-09-21');

      cy.get(`[data-cy="streetAddress"]`).type('engage SMTP Grocery').should('have.value', 'engage SMTP Grocery');

      cy.get(`[data-cy="city"]`).type('Casperland').should('have.value', 'Casperland');

      cy.get(`[data-cy="stateProvince"]`).type('redundant cross-media Regional').should('have.value', 'redundant cross-media Regional');

      cy.get(`[data-cy="postalCode"]`).type('Dinar Grocery synthesize').should('have.value', 'Dinar Grocery synthesize');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        heroDetails = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', heroDetailsPageUrlPattern);
    });
  });
});
