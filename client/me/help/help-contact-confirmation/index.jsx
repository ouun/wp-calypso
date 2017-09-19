/**
 * External dependencies
 */
import Gridicon from 'gridicons';
import PropTypes from 'prop-types';

import React from 'react';

/**
 * Internal dependencies
 */
import FormSectionHeading from 'components/forms/form-section-heading';
import PureRenderMixin from 'react-pure-render/mixin';

module.exports = React.createClass( {
	mixins: [ PureRenderMixin ],

	propTypes: {
		title: PropTypes.string.isRequired,
		message: PropTypes.node.isRequired
	},

	render: function() {
		return (
			<div className="help-contact-confirmation">
				<div className="help-contact-confirmation__contents">
					<div className="help-contact-confirmation__large-gridicon"><Gridicon icon={ 'checkmark-circle' } size={ 96 } /></div>
					<div className="help-contact-confirmation__small-gridicon"><Gridicon icon={ 'checkmark-circle' } size={ 56 } /></div>
					<FormSectionHeading>{ this.props.title }</FormSectionHeading>
					<p className="help-contact-confirmation__message">{ this.props.message }</p>
				</div>
			</div>
		);
	}
} );
