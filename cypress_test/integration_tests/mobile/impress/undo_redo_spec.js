/* global describe it cy beforeEach require afterEach */

var helper = require('../../common/helper');
var mobileHelper = require('../../common/mobile_helper');
var impressHelper = require('../../common/impress_helper');

describe('Editing Operations', function() {
	var testFileName = 'undo_redo.odp';

	beforeEach(function() {
		helper.beforeAll(testFileName, 'impress');

		// Click on edit button
		mobileHelper.enableEditingMobile();

		impressHelper.selectTextShapeInTheCenter();

		cy.get('g.leaflet-control-buttons-disabled svg').dblclick({force:true});

		cy.wait(1000);

		helper.typeIntoDocument('Hello World');
	});

	afterEach(function() {
		helper.afterAll(testFileName, this.currentTest.state);
	});


	function undo() {
		cy.get('path.leaflet-interactive').dblclick();

		//if we don't wait tests in CLI is failing
		cy.wait(3000);

		cy.get('#tb_actionbar_item_undo').click();

		helper.selectAllText();

		cy.wait(1000);

		helper.expectTextForClipboard('Hello Worl');
	}

	it('Undo', function() {
		undo();
	});


	it('Redo',function() {
		undo();

		cy.get('#tb_actionbar_item_redo').click();

		helper.selectAllText();

		cy.wait(1000);

		helper.expectTextForClipboard('Hello World');
	});

	it('Repair Document', function() {
		cy.get('#toolbar-hamburger')
			.click()
			.get('.menu-entry-icon.editmenu').parent()
			.click()
			.get('.menu-entry-icon.repair').parent()
			.click();

		cy.get('.leaflet-popup-content table').should('exist');

		cy.contains('.leaflet-popup-content table tbody tr','Undo').eq(0)
			.click();

		cy.get('.leaflet-popup-content > input').click();

		impressHelper.selectTextShapeInTheCenter();

		impressHelper.selectTextOfShape();

		cy.wait(1000);

		helper.expectTextForClipboard('Hello Worl');
	});
});
