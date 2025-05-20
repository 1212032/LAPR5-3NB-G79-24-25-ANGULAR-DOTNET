import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'c1kyt8',

  e2e: {
    'baseUrl': 'http://localhost:4200',
    experimentalModifyObstructiveThirdPartyCode: true,
    chromeWebSecurity: false
  },
  // env: {
  //   clientId: "api://8cb4473b-fbec-4737-ac14-973ccc04d086",
  //   clientSecret: "Ab68Q~1eO-14pX1Bp4tubzUFNBo.qA9jhNZ.tc09",
  //   tenantId: 'f8da0c59-22a8-4891-bc76-7a603e362eac',
  //   username: "sem5pi_g79_doctor@hotmail.com",
  //   password: "Panados123!",
  // },
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts'
  }

})