import { Dashicon, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const ImportModalError = ( { message, code } ) => {
	return (
		<div className="well error">
			{ message && (
				<h3>
					<Dashicon icon="warning" />
					<span>{ message }</span>
				</h3>
			) }
			<ul>
				<li
					dangerouslySetInnerHTML={ {
						__html: cossDash.onboarding.i18n.troubleshooting,
					} }
				/>
				<li
					dangerouslySetInnerHTML={ {
						__html: cossDash.onboarding.i18n.support,
					} }
				/>
				{ code && (
					<li>
						{ __( 'Error code', 'codeless-starter-sites' ) }:{ ' ' }
						<code>{ code }</code>
					</li>
				) }
				<li>
					{ __( 'Error log', 'codeless-starter-sites' ) }:{ ' ' }
					<Button isLink href={ cossDash.onboarding.logUrl }>
						{ cossDash.onboarding.logUrl }
						<Dashicon icon="external" />
					</Button>
				</li>
			</ul>
		</div>
	);
};

export default ImportModalError;
