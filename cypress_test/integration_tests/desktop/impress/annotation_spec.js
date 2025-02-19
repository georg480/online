/* global describe it cy require afterEach beforeEach Cypress */

var desktopHelper = require('../../common/desktop_helper');
var helper = require('../../common/helper');
var { addSlide, changeSlide } = require('../../common/impress_helper');
var { insertMultipleComment } = require('../../common/desktop_helper');

describe('Annotation Tests', function() {
	var testFileName = 'comment_switching.odp';

	beforeEach(function() {
		helper.beforeAll(testFileName, 'impress');

		if (Cypress.env('INTEGRATION') === 'nextcloud') {
			desktopHelper.hideSidebarIfVisible();
		} else if (Cypress.env('USER_INTERFACE') === 'notebookbar') {
			cy.get('#ModifyPage').click();
		} else {
			desktopHelper.hideSidebar();
		}

		desktopHelper.selectZoomLevel('50');
	});

	afterEach(function() {
		helper.afterAll(testFileName, this.currentTest.state);
	});


	it('Insert', function() {
		insertMultipleComment('impress');
		cy.get('.leaflet-marker-icon').should('exist');
		cy.get('.loleaflet-annotation-content > div')
			.should('contain','some text');
	});

	it('Modify', function() {
		insertMultipleComment('impress');

		cy.get('.leaflet-marker-icon').should('exist');

		cy.get('#annotation-content-area-1').should('contain','some text0');

		cy.get('#comment-annotation-menu-1').click();

		cy.contains('.context-menu-item','Modify').click();

		cy.get('#annotation-modify-textarea-1').type('some other text, ');

		cy.get('#annotation-save-1').click();

		cy.get('#annotation-content-area-1').should('contain','some other text, some text0');

		cy.get('.leaflet-marker-icon').should('exist');
	});

	it('Remove',function() {
		insertMultipleComment('impress');

		cy.get('.leaflet-marker-icon').should('exist');

		cy.get('.loleaflet-annotation-content > div').should('contain','some text');

		cy.get('.loleaflet-annotation-menu').click();

		cy.contains('.context-menu-item','Remove')
			.click();

		cy.get('.leaflet-marker-icon').should('not.exist');
	});

	it('Reply',function() {
		insertMultipleComment('impress');

		cy.get('.leaflet-marker-icon').should('exist');

		cy.get('.loleaflet-annotation-content > div').should('contain','some text');

		cy.get('#comment-annotation-menu-1').click();

		cy.contains('.context-menu-item','Reply').click();

		cy.get('#annotation-reply-textarea-1').type('some reply text');

		cy.get('#annotation-reply-1').click();

		cy.get('.loleaflet-annotation-content > div').should('include.text','some reply text');
	});
});

describe('Comment Scrolling',function() {
	var testFileName = 'comment_switching.odp';

	beforeEach(function() {
		helper.beforeAll(testFileName, 'impress');
	});

	afterEach(function() {
		helper.afterAll(testFileName, this.currentTest.state);
	});

	it('no comment or one comment', function() {
		cy.wait(1000);
		cy.get('.leaflet-control-scroll-down').should('not.exist');
		insertMultipleComment('impress');
		cy.get('.leaflet-marker-icon').should('exist');
	});

	it('omit slides without comments', function() {
		cy.wait(1000);
		//scroll up
		insertMultipleComment('impress');
		addSlide(2);
		insertMultipleComment('impress');
		cy.get('.leaflet-control-scroll-up').should('exist');
		cy.get('.leaflet-control-scroll-up').click().wait(300);
		cy.get('#PageStatus').should('contain','Slide 1 of 3');

		//scroll down
		cy.get('.leaflet-control-scroll-down').should('exist');
		cy.get('.leaflet-control-scroll-down').click().wait(1000);
		cy.get('#PageStatus').should('contain','Slide 3 of 3');
	});


	it('switch to previous or next slide',function() {
		addSlide(1);
		insertMultipleComment('impress', 2);

		//scroll up
		addSlide(1);
		cy.get('.leaflet-control-scroll-up').should('exist');
		cy.get('.leaflet-control-scroll-up').click().wait(300);
		cy.get('#PageStatus').should('contain','Slide 2 of 3');

		//scroll down
		changeSlide(1,'previous');
		cy.get('.leaflet-control-scroll-down').should('exist');
		cy.get('.leaflet-control-scroll-down').click().wait(300);
		cy.get('#PageStatus').should('contain','Slide 2 of 3');
	});
});
