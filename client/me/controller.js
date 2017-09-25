/**
 * External dependencies
 */
import i18n from 'i18n-calypso';
import { includes } from 'lodash';
import page from 'page';
import React from 'react';
import ReactDom from 'react-dom';

/**
 * Internal dependencies
 */
import NextSteps from './next-steps';
import analytics from 'lib/analytics';
import { renderWithReduxStore } from 'lib/react-helpers';
import route from 'lib/route';
import trophiesData from 'lib/trophies-data';
import userSettings from 'lib/user-settings';
import AppsComponent from 'me/get-apps';
import ProfileComponent from 'me/profile';
import SidebarComponent from 'me/sidebar';
import { setDocumentHeadTitle as setTitle } from 'state/document-head/actions';

const ANALYTICS_PAGE_TITLE = 'Me';

export default {
	sidebar( context, next ) {
	    renderWithReduxStore(
			React.createElement( SidebarComponent, {
				context: context
			} ),
			document.getElementById( 'secondary' ),
			context.store
		);

		next();
	},

	profile( context ) {
		const basePath = context.path;

		context.store.dispatch( setTitle( i18n.translate( 'My Profile', { textOnly: true } ) ) ); // FIXME: Auto-converted from the Flux setTitle action. Please use <DocumentHead> instead.

		analytics.pageView.record( basePath, ANALYTICS_PAGE_TITLE + ' > My Profile' );

		renderWithReduxStore(
			React.createElement( ProfileComponent,
				{
					userSettings: userSettings,
					path: context.path
				}
			),
			document.getElementById( 'primary' ),
			context.store
		);
	},

	apps( context ) {
	    const basePath = context.path;

		context.store.dispatch( setTitle( i18n.translate( 'Get Apps', { textOnly: true } ) ) ); // FIXME: Auto-converted from the Flux setTitle action. Please use <DocumentHead> instead.

		analytics.pageView.record( basePath, ANALYTICS_PAGE_TITLE + ' > Get Apps' );

		renderWithReduxStore(
			React.createElement( AppsComponent,
				{
					userSettings: userSettings,
					path: context.path
				}
			),
			document.getElementById( 'primary' ),
			context.store
		);
	},

	nextSteps( context ) {
		const analyticsBasePath = route.sectionify( context.path ), isWelcome = 'welcome' === context.params.welcome;

		context.store.dispatch( setTitle( i18n.translate( 'Next Steps', { textOnly: true } ) ) ); // FIXME: Auto-converted from the Flux setTitle action. Please use <DocumentHead> instead.

		if ( isWelcome ) {
			ReactDom.unmountComponentAtNode( document.getElementById( 'secondary' ) );
		}

		analytics.tracks.recordEvent( 'calypso_me_next_view', { is_welcome: isWelcome } );
		analytics.pageView.record( analyticsBasePath, ANALYTICS_PAGE_TITLE + ' > Next' );

		renderWithReduxStore(
			React.createElement( NextSteps, {
				path: context.path,
				isWelcome: isWelcome,
				trophiesData: trophiesData
			} ),
			document.getElementById( 'primary' ),
			context.store
		);
	},

	// Users that are redirected to `/me/next?welcome` after signup should visit
	// `/me/next/welcome` instead.
	nextStepsWelcomeRedirect( context, next ) {
		if ( includes( context.path, '?welcome' ) ) {
			return page.redirect( '/me/next/welcome' );
		}

		next();
	},

	profileRedirect() {
		page.redirect( '/me' );
	},

	trophiesRedirect() {
		page.redirect( '/me' );
	},

	findFriendsRedirect() {
		page.redirect( '/me' );
	}
};
