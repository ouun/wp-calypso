/**
 * Internal dependencies
 */
import CartSynchronizer from '../cart-synchronizer';
import FakeWPCOM from './fake-wpcom';
import assert from 'assert';
import cartValues from 'lib/cart-values';
import useFilesystemMocks from 'test/helpers/use-filesystem-mocks';

const TEST_CART_KEY = 91234567890;

const poller = {
	add: function() {}
};

describe( 'cart-synchronizer', function() {
	let applyCoupon, emptyCart;

	useFilesystemMocks( __dirname );

	before( () => {
	    applyCoupon = cartValues.applyCoupon;
		emptyCart = cartValues.emptyCart;
	} );

	describe( '*before* the first fetch from the server', function() {
		it( 'should *not* allow the value to be read', function() {
			let wpcom = FakeWPCOM(),
				synchronizer = CartSynchronizer( TEST_CART_KEY, wpcom, poller );

			assert.throws( () => {
				synchronizer.getLatestValue();
			}, Error );
		} );

		it( 'should enqueue local changes and POST them after fetching', function() {
			let wpcom = FakeWPCOM(),
				synchronizer = CartSynchronizer( TEST_CART_KEY, wpcom, poller ),
				serverCart = emptyCart( TEST_CART_KEY );

			synchronizer.fetch();
			synchronizer.update( applyCoupon( 'foo' ) );

			assert.throws( () => {
				synchronizer.getLatestValue();
			}, Error );
			wpcom.resolveRequest( 0, serverCart );

			assert.equal( synchronizer.getLatestValue().coupon, 'foo' );
			assert.equal( wpcom.getRequest( 1 ).method, 'POST' );
			assert.equal( wpcom.getRequest( 1 ).cart.coupon, 'foo' );

			wpcom.resolveRequest( 1, applyCoupon( 'bar' )( serverCart ) );
			assert.equal( synchronizer.getLatestValue().coupon, 'bar' );
		} );
	} );

	describe( '*after* the first fetch from the server', function() {
		it( 'should allow the value to be read', function() {
			let wpcom = FakeWPCOM(),
				synchronizer = CartSynchronizer( TEST_CART_KEY, wpcom, poller ),
				serverCart = emptyCart( TEST_CART_KEY );

			synchronizer.fetch();
			wpcom.resolveRequest( 0, serverCart );

			assert.equal( synchronizer.getLatestValue().blog_id, serverCart.blog_id );
		} );
	} );

	it( 'should make local changes visible immediately', function() {
		let wpcom = FakeWPCOM(),
			synchronizer = CartSynchronizer( TEST_CART_KEY, wpcom, poller ),
			serverCart = emptyCart( TEST_CART_KEY );

		synchronizer.fetch();
		wpcom.resolveRequest( 0, serverCart );

		synchronizer.update( applyCoupon( 'foo' ) );
		assert.equal( synchronizer.getLatestValue().coupon, 'foo' );
	} );
} );
