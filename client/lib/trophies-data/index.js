/**
 * External dependencies
 */
import debugFactory from 'debug';
import store from 'store';

/**
 * Internal dependencies
 */
import Emitter from 'lib/mixins/emitter';

const debug = debugFactory( 'calypso:trophies-data' );

/**
 * Internal dependencies
 */
const wpcom = require( 'lib/wp' ).undocumented();

function TrophiesData() {
	if ( ! ( this instanceof TrophiesData ) ) {
		return new TrophiesData();
	}

	this.initialized = false;
}

Emitter( TrophiesData.prototype );

TrophiesData.prototype.get = function() {
	let data;
	if ( ! this.data ) {
		data = store.get( 'TrophiesData' );

		if ( data ) {
			this.initialize( data );
		} else {
			this.data = [];
		}

		this.emit( 'change' );
		this.fetch();
	}
	return this.data;
};

TrophiesData.prototype.fetch = function() {
	wpcom.me().getTrophies( function( error, data ) {
		if ( error ) {
			debug( error.error, error.message );
		}

		this.data = data;

		if ( ! this.initialized ) {
			this.initialized = true;
			this.emit( 'change' );
		}

		store.set( 'TrophiesData', data );
	}.bind( this ) );
};

TrophiesData.prototype.initialize = function( TrophiesData ) {
	this.data = TrophiesData;
	this.initialized = true;
};

TrophiesData.prototype.hasLoadedFromServer = function() {
	return this.initialized;
};

export default new TrophiesData();
