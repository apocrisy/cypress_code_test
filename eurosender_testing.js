/// <reference types="Cypress" />

describe('Eurosender test', function () {
    it('An end to end ordering test', function () {
        // Step 1, open Eurosender URL
        cy.visit('https://www.eurosender.com')

        // Step 2, From the FROM(PICKUP) country select Slovenia and as TO(DELIVERY) select Austria.
        cy.get('#from_id').click().type("slo")
        cy.contains('Slovenia').click()

        cy.get('#to_id').click().type("aust")
        cy.get('#react-select-3-option-0').click()

        //Step 3: From the “Who orders?” field validate if the default selected option is “Private person” and asserts its state.
        cy.get('#person').should('be.checked')

        //Step 4 From the extendable form validate if only “Package or suitcase” has quantity “1” (assuming there are/could be multiple elements .each is used, same for step 5)
        cy.get('input[value="1"]').each(($el, index, $list) => {
            const expectedId = ["packages"]
            cy.log($el)
            cy.get('input[value="1"]').eq(index).should('have.id', expectedId[index])


        })

        //Step 5 Validate if the other service types in the extendable form have quantity “0” 
        cy.get('input[value="0"]').each(($el, index, $list) => {
            const expectedIds = ["envelopes", "pallets", "vans", "non-standard"]
            cy.log($el)
            cy.get('input[value="0"]').eq(index).should('have.id', expectedIds[index])

        })

        //Step 6 click continue (since there is a button with the same name for tablet (on index 0) a parent / child selector is used)
        cy.get("div[class*=priceSection_desktop] button[type=submit]").click()

        //Step 7 On the “Order details” page validate two “Shipping options” (Regular, Express)
        cy.get("label[for=regular]").should('be.visible')
        cy.get("label[for=express]").should('be.visible')

        //Step 8 Validate if default selection is “Regular” by asserting its name and current state (selected/deselected)
        cy.get("#regular").should('be.checked')

        //Step 9 Store the current order service price 
        //nesting because of promise resolution within cypress, so that price values are within scope.
        cy.get("div[class*=priceValue").then(($price => {
            const storedPrice = $price.text()

            //Step 10 Validate if “Express” button has the correct text “Express Delivery time: EU in 24h / Globally in 48-72h” if validation is passing click the button 
            //longer comment at the bottom of the test case.
            cy.get("label[for=express] div[class*='itemText']").contains("Express").find("p[class*=itemSubtitle]").contains("Delivery time: EU in 24h / Globally in 48-72h")
            cy.get("label[for=express]").click()

            //Step 11 	Confirm if the price has changed 
            cy.get("div[class*=priceValue").then(($newPrice) => {
                const newStoredPrice = $newPrice.text()
                expect(newStoredPrice).to.not.equal(storedPrice)
            })

            //Step 12 Validate “Shipment details” by validating visibility of input fields and their name (Sender, address, etc) 
            //Sender field validation
            cy.get("input[id*='pickup']").should('be.visible')
            //Delivery field validation
            cy.get("input[id*='delivery']").should('be.visible')


        }))



        //for step 10 - newline can not be replaced with argument .replace("\n", ""),  .contains ignores whitespaces but will fail if multiple elements present in the same div (so we traverse from /div to /p tag)



    })
})