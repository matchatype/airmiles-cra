/// <reference types="cypress" />

describe('AirMiles Technical Interview App', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display a list of offers by default', () => {
    cy.findByTestId('offers').should('exist').should('have.lengthOf', 1)
    cy.findAllByTestId('offer').as('offers')

    cy.get('@offers')
      .find('.offer__title')
      .should('be.visible')
      .invoke('text')
      .should('match', /^(?!\s*$).+/) // Match non empty strings

    cy.get('@offers')
      .find('.offer__description')
      .should('be.visible')
      .should('have.descendants', 'p')

    cy.get('@offers')
      .find('button')
      .should('be.visible')
      .should('be.enabled')
      .invoke('text')
      .should('match', /favorite/i)
  })

  it('should allow setting favorite cards', () => {
    cy.findAllByTestId('offer')
      .as('offers')
      .should('have.class', 'card__item--blue')

    cy.get('@offers')
      .its('length')
      .then(length => {
        const selected = Cypress._.random(length - 1) // lower = 0 is default
        cy.get('@offers').eq(selected).findByTestId('favorite-button').click()
        cy.get('@offers').eq(selected).should('have.class', 'card__item--coral')
      })
  })
})

export {}
