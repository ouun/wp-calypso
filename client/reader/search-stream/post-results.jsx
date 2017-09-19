/** @format */
/**
 * External dependencies
 */
import { localize } from 'i18n-calypso';
import { identity } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

/**
 * Internal dependencies
 */
import EmptyContent from './empty';
import { RelatedPostCard } from 'blocks/reader-related-card-v2';
import { SEARCH_RESULTS } from 'reader/follow-button/follow-sources';
import HeaderBack from 'reader/header-back';
import Stream from 'reader/stream';
import PostPlaceholder from 'reader/stream/post-placeholder';

class PostResults extends Component {
	static propTypes = {
		query: PropTypes.string,
	};

	placeholderFactory = ( { key, ...rest } ) => {
		if ( ! this.props.query ) {
			return (
				<div className="search-stream__recommendation-list-item" key={ key }>
					<RelatedPostCard { ...rest } />
				</div>
			);
		}
		return <PostPlaceholder key={ key } />;
	};

	render() {
		const { query, translate } = this.props;
		const emptyContent = <EmptyContent query={ query } />;
		const transformStreamItems =
			! query || query === '' ? postKey => ( { ...postKey, isRecommendation: true } ) : identity;

		return (
			<Stream
				{ ...this.props }
				followSource={ SEARCH_RESULTS }
				listName={ translate( 'Search' ) }
				emptyContent={ emptyContent }
				showFollowInHeader={ true }
				placeholderFactory={ this.placeholderFactory }
				shouldCombineCards={ true }
				transformStreamItems={ transformStreamItems }
				isMain={ false }
			>
				{ this.props.showBack && <HeaderBack /> }
				<div ref={ this.handleStreamMounted } />
			</Stream>
		);
	}
}

export default localize( PostResults );
