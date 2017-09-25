/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import PopupMonitor from '../';
import useFakeDom from 'test/helpers/use-fake-dom';

describe( 'PopupMonitor', function() {
	let popupMonitor;

	useFakeDom();

	before( () => {
		Object.assign( global.window, {
			screenTop: 0,
			screenLeft: 0,
			innerWidth: 1280,
			innerHeight: 720
		} );
	} );

	beforeEach( function() {
		popupMonitor = new PopupMonitor();
	} );

	describe( '#getScreenCenterSpecs()', function() {
		it( 'should generate a popup specification string given the desired width and height', function() {
			const specs = popupMonitor.getScreenCenterSpecs( 650, 500 );

			expect( specs ).to.equal( 'width=650,height=500,top=110,left=315' );
		} );
	} );
} );
