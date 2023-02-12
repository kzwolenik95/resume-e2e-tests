describe('Test counter', () => {
  it('Visit resume and check if visit cookie is set!', () => {
    cy.visit('resume/')
    cy.contains(/This page has been visited \d+ times!/)
    cy.getCookie('visited')
      .should('have.property', 'value', 'true')
  })
  it('Visit resume and check if counter value is a number!', () => {
    cy.visit('resume/')
    cy.contains(/This page has been visited \d+ times!/)
    cy.getCookie('counter_value')
      .then((cookie) => {
      assert.isNumber(Number(cookie.value))
    })
  })
  it('Visit resume and assert that counter value increased!', () => {
    cy.visit('resume/')
    cy.contains(/This page has been visited \d+ times!/)
    cy.getCookie('counter_value')
      .then((cookie) => {
        const num1 = Number(cookie.value)
        cy.clearCookies()
        cy.reload()
        cy.contains(/This page has been visited \d+ times!/)
        cy.getCookie('counter_value').then((cookie) => {
          expect(Number(cookie.value)).to.be.greaterThan(num1)
        })
      })
  })
  it('Assert increment and get call not made when cookie set!', () => {
    cy.setCookie('visited', 'true')
    cy.setCookie('counter_value', '25')
    cy.visit('resume/')
    cy.intercept('**/increment').as('myRequest')
    cy.wait(500);
    cy.get('@myRequest.all').then((interceptions) => {
        expect(interceptions).to.be.length(0);
    });
  })
})
