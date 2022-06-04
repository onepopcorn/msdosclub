/// <reference types="Cypress" />

// Navigate through posts
// Get post from post list
// Open & close post detail
// Can change different post types (menu)
// Timeline infinite scroll
//

describe('Posts', () => {
    beforeEach(() => {
        cy.intercept('GET', 'https://msdos.club/wp-json/wp/v2/posts?*', (req) => {
            const { page } = req.query
            req.reply((res) => {
                res.send({
                    headers: {
                        'x-wp-total': '12',
                        'x-wp-totalpages': '2',
                    },
                    fixture: `podcasts_page_${page}.json`,
                })
            })
        }).as('pageLoad')
        cy.visit('/')
    })

    it('Should load more posts when scrolling', () => {
        cy.wait('@pageLoad')
        cy.contains('button', 'Le Fetiche Maya, VGA Planets y FreeDOS 1.3')
        cy.scrollTo(0, 500)
        cy.wait('@pageLoad')
        cy.contains('button', 'Spider Run, Shadowlands y revistas que regalan virus')
    })

    it('Should open/close detail view when clicked', () => {
        cy.findByRole('button', { name: /le fetiche maya/i }).as('button')
        cy.get('@button').click()

        // Check for content
        cy.findByText(/El DOS está de moda, no es por nada que acaba de salir la versión 1\.3 de FreeDOS/i)
        cy.go('back')

        cy.get('@button').click()
        cy.findByTestId('close-btn').click()

        cy.contains(/El DOS está de moda, no es por nada que acaba de salir la versión 1\.3 de FreeDOS/i).should(
            'not.exist',
        )
    })
})

// describe('Navigate through posts', () => {
//     beforeEach(() => {
//         cy.visit('/')
//     })

//     it('should load more content on scrolling', () => {
//         cy.findAllByRole('article')
//             .first().findAllByRole('button')
//             .first().click()

//         cy.get('[data-testid="close-btn"]')
//             .click()
//     })
// })
