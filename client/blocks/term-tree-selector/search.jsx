/**
 * External dependencies
 */
import Gridicon from 'gridicons';
import PropTypes from 'prop-types';

import React from 'react';

export default React.createClass( {
	displayName: 'TermTreeSelectorSearch',

	propTypes: {
		searchTerm: PropTypes.string,
		onSearch: PropTypes.func.isRequired
	},

	render() {
		return (
			<div className="term-tree-selector__search">
				<Gridicon icon="search" size={ 18 } />
				<input type="search"
					placeholder={ this.translate( 'Search…', { textOnly: true } ) }
					value={ this.props.searchTerm }
					onChange={ this.props.onSearch } />
			</div>
		);
	}
} );
