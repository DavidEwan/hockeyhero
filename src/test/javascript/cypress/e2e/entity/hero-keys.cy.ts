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

describe('HeroKeys e2e test', () => {
  const heroKeysPageUrl = '/hero-keys';
  const heroKeysPageUrlPattern = new RegExp('/hero-keys(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const heroKeysSample = {};

  let heroKeys;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/hero-keys+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/hero-keys').as('postEntityRequest');
    cy.intercept('DELETE', '/api/hero-keys/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (heroKeys) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/hero-keys/${heroKeys.id}`,
      }).then(() => {
        heroKeys = undefined;
      });
    }
  });

  it('HeroKeys menu should load HeroKeys page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('hero-keys');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('HeroKeys').should('exist');
    cy.url().should('match', heroKeysPageUrlPattern);
  });

  describe('HeroKeys page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(heroKeysPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create HeroKeys page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/hero-keys/new$'));
        cy.getEntityCreateUpdateHeading('HeroKeys');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', heroKeysPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/hero-keys',
          body: heroKeysSample,
        }).then(({ body }) => {
          heroKeys = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/hero-keys+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [heroKeys],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(heroKeysPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details HeroKeys page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('heroKeys');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', heroKeysPageUrlPattern);
      });

      it('edit button click should load edit HeroKeys page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('HeroKeys');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', heroKeysPageUrlPattern);
      });

      it('edit button click should load edit HeroKeys page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('HeroKeys');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', heroKeysPageUrlPattern);
      });

      it('last delete button click should delete instance of HeroKeys', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('heroKeys').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', heroKeysPageUrlPattern);

        heroKeys = undefined;
      });
    });
  });

  describe('new HeroKeys page', () => {
    beforeEach(() => {
      cy.visit(`${heroKeysPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('HeroKeys');
    });

    it('should create an instance of HeroKeys', () => {
      cy.get(`[data-cy="hideMe"]`).should('not.be.checked');
      cy.get(`[data-cy="hideMe"]`).click().should('be.checked');

      cy.get(`[data-cy="latitude"]`).type('83932').should('have.value', '83932');

      cy.get(`[data-cy="longitude"]`).type('54053').should('have.value', '54053');

      cy.get(`[data-cy="age"]`).type('72909').should('have.value', '72909');

      cy.get(`[data-cy="myPosition"]`).type('43484').should('have.value', '43484');

      cy.get(`[data-cy="skill"]`).type('83915').should('have.value', '83915');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        heroKeys = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', heroKeysPageUrlPattern);
    });
  });
});
