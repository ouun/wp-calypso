/**
 * External dependencies
 */
import { union } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Internal dependencies
 */
import SiteIcon from 'blocks/site-icon';

const MAX_ICONS = 10;

export default React.createClass( {
	displayName: 'AllSitesIcon',

	propTypes: {
		sites: PropTypes.array.isRequired,
	},

	getMaxSites() {
		return this.props.sites.slice( 0, MAX_ICONS );
	},

	getSitesWithIcons() {
		return this.props.sites.filter( function( site ) {
			return site.icon;
		} ).slice( 0, MAX_ICONS );
	},

	getIcons() {
		const sites = union( this.getSitesWithIcons(), this.getMaxSites() ).slice( 0, MAX_ICONS );
		return sites.map( function( site ) {
			return <SiteIcon site={ site } key={ site.ID + '-icon' } size={ 14 } />;
		} );
	},

	render() {
		const icons = this.getIcons();
		const classes = `all-sites-icon has-${ this.getMaxSites().length }-icons`;

		return (
			<div className={ classes }>
				{ icons }
			</div>
		);
	}
} );
