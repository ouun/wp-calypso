/**
 * External dependencies
 */
import { localize } from 'i18n-calypso';
import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import Site from 'blocks/site';
import Button from 'components/button';
import Count from 'components/count';
import QueryPostCounts from 'components/data/query-post-counts';
import QueryPosts from 'components/data/query-posts';
import Popover from 'components/popover';
import Draft from 'my-sites/draft';
import { getCurrentUserId } from 'state/current-user/selectors';
import { getMyPostCounts } from 'state/posts/counts/selectors';
import { getSitePostsForQueryIgnoringPage, isRequestingSitePostsForQuery } from 'state/posts/selectors';
import { getSelectedSite } from 'state/ui/selectors';
import { getSelectedSiteId } from 'state/ui/selectors';

class MasterbarDrafts extends Component {
	static propTypes = {
		user: PropTypes.object,
		isActive: PropTypes.bool,
		className: PropTypes.string,
		tooltip: PropTypes.string,
		selectedSite: PropTypes.object,
	};

	state = {
		showDrafts: false
	};

	toggleDrafts = () => {
		const { showDrafts } = this.state;
		this.setState( {
			showDrafts: ! showDrafts
		} );
	};

	closeDrafts = () => {
		this.setState( { showDrafts: false } );
	};

	render() {
		const { selectedSite, draftCount, loadingDrafts, translate } = this.props;
		const isLoading = draftCount !== 0 && loadingDrafts;

		if ( ! selectedSite ) {
			return null;
		}

		return (
			<div>
				<QueryPostCounts siteId={ selectedSite.ID } type="post" />
				{ this.props.draftCount > 0 &&
					<Button
						compact borderless className="masterbar__toggle-drafts"
						onClick={ this.toggleDrafts }
						ref="drafts"
						title={ translate( 'Latest Drafts' ) }
					>
						<Count count={ this.props.draftCount } />
					</Button>
				}
				<Popover
					isVisible={ this.state.showDrafts }
					onClose={ this.closeDrafts }
					position="bottom left"
					context={ this.refs && this.refs.drafts }
					className="masterbar__recent-drafts"
				>
					<QueryPosts
						siteId={ selectedSite.ID }
						query={ this.props.draftsQuery } />
					<Site compact site={ selectedSite } />
					{ this.props.drafts && this.props.drafts.map( this.renderDraft, this ) }
					{ isLoading && <Draft isPlaceholder /> }
					{ this.props.draftCount > 6 &&
						<Button
							compact
							borderless
							className="masterbar__see-all-drafts"
							href={ `/posts/drafts/${ selectedSite.slug }` }
							onClick={ this.closeDrafts }
						>
							{ translate( 'See all drafts' ) }
							{ this.props.draftCount ? <Count count={ this.props.draftCount } /> : null }
						</Button>
					}
				</Popover>
			</div>
		);
	}

	renderDraft( draft ) {
		if ( ! draft ) {
			return null;
		}

		const site = this.props.selectedSite;

		return <Draft
			key={ draft.global_ID }
			post={ draft }
			siteId={ site && site.ID }
			showAuthor={ site && ! site.single_user_site && ! this.props.userId }
			onTitleClick={ this.closeDrafts }
		/>;
	}
}

export default connect( ( state ) => {
	const siteId = getSelectedSiteId( state );
	const userId = getCurrentUserId( state );
	const site = getSelectedSite( state );
	const draftsQuery = {
		type: 'post',
		status: 'draft',
		number: 10,
		order_by: 'modified',
		author: ( site && ! site.jetpack && ! site.single_user_site ) ? userId : null
	};

	const myPostCounts = getMyPostCounts( state, siteId, 'post' );

	return {
		drafts: getSitePostsForQueryIgnoringPage( state, siteId, draftsQuery ),
		loadingDrafts: isRequestingSitePostsForQuery( state, siteId, draftsQuery ),
		draftsQuery: draftsQuery,
		draftCount: myPostCounts && myPostCounts.draft,
		selectedSite: site,
	};
} )( localize( MasterbarDrafts ) );
