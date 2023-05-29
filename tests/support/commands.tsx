export {}
/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
import '@testing-library/cypress/add-commands'
import { ThemeProvider } from 'dataverse-design-system'
import { ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18next from '../../src/i18n'

// Define your custom mount function

Cypress.Commands.add('customMount', (component: ReactNode) => {
  return cy.mount(
    <ThemeProvider>
      <I18nextProvider i18n={i18next}>{component}</I18nextProvider>
    </ThemeProvider>
  )
})

Cypress.Commands.add('loginAsAdmin', (go: string) => {
  cy.visit('/')
  cy.findByRole('link', { name: /Log In/i }).click()
  cy.findByLabelText('Username/Email').type('dataverseAdmin')
  cy.findByLabelText('Password').type('admin1')
  cy.findByRole('button', { name: /Log In/i }).click()
  cy.findByText(/Dataverse Admin/i).should('exist')
  cy.visit(go)
})
