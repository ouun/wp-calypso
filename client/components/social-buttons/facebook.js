/**
 * External dependencies
 */
import classNames from 'classnames';
import { localize } from 'i18n-calypso';
import { noop } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import FacebookIcon from 'components/social-icons/facebook';
import { loadScript } from 'lib/load-script';
import { isFormDisabled } from 'state/login/selectors';

class FacebookLoginButton extends Component {
	// See: https://developers.facebook.com/docs/javascript/reference/FB.init/v2.8
	static propTypes = {
		isFormDisabled: PropTypes.bool,
		appId: PropTypes.string.isRequired,
		version: PropTypes.string,
		cookie: PropTypes.bool,
		status: PropTypes.bool,
		xfbml: PropTypes.bool,
		responseHandler: PropTypes.func.isRequired,
		scope: PropTypes.string,
		translate: PropTypes.func.isRequired,
		onClick: PropTypes.func,
	};

	static defaultProps = {
		version: 'v2.8',
		cookie: false,
		status: false,
		xfbml: true,
		scope: 'public_profile,email',
		onClick: noop,
	};

	constructor( props ) {
		super( props );

		this.initialized = null;
		this.handleClick = this.handleClick.bind( this );
	}

	componentWillMount() {
		this.initialize();
	}

	loadDependency() {
		if ( window.FB ) {
			return Promise.resolve( window.FB );
		}

		return new Promise( resolve => {
			loadScript( '//connect.facebook.net/en_US/sdk.js', () => resolve( window.FB ) );
		} );
	}

	initialize() {
		if ( this.initialized ) {
			return this.initialized;
		}

		this.initialized = this.loadDependency().then( FB => {
			FB.init( {
				appId: this.props.appId,
				version: this.props.version,
				cookie: this.props.cookie,
				xfbml: this.props.xfbml,
			} );

			return FB;
		} ).catch( error => {
			this.initialized = null;

			return Promise.reject( error );
		} );

		return this.initialized;
	}

	handleClick( event ) {
		event.preventDefault();

		this.props.onClick( event );

		const { responseHandler, scope } = this.props;

		// Handle click async if the library is not loaded yet
		// the popup might be blocked by the browser in that case
		this.initialize().then( FB => {
			FB.login( response => {
				responseHandler( response );
			}, { scope } );
		} );
	}

	render() {
		const isDisabled = Boolean( this.props.isFormDisabled );

		return (
			<div className="social-buttons__button-container">
				<button
					className={ classNames( 'social-buttons__button button', { disabled: isDisabled } ) }
					onClick={ this.handleClick }
				>
					<FacebookIcon />

					<span className="social-buttons__service-name">
						{ this.props.translate( 'Continue with %(service)s', {
							args: { service: 'Facebook' },
							comment: '%(service)s is the name of a Social Network, e.g. "Google", "Facebook", "Twitter" ...'
						} ) }
					</span>
				</button>
			</div>
		);
	}
}

export default connect(
	( state ) => ( {
		isFormDisabled: isFormDisabled( state ),
	} ),
)( localize( FacebookLoginButton ) );
