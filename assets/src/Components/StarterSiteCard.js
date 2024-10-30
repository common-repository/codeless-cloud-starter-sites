import { Button, Dashicon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { useState } from '@wordpress/element';

const StarterSiteCard = ( {
	data,
	setSite,
	setPreview,
	setModal,
	themeStatus,
	setInstallModal,
} ) => {
	const { upsell } = data;
	const [ actionsClass, setActionClass ] = useState( '' );
	const { license } = cossDash;
	const showActions = () => {
		setActionClass( 'visible' );
	};
	const hideActions = () => {
		setActionClass( '' );
	};

	const launchImport = ( e ) => {
		e.preventDefault();
		setSite( data );

		if ( !cossDash.activeTheme && !data.is_free ) {
			setInstallModal( true );

			return false;
		}
		setModal( true );
	};

	const launchPreview = ( e ) => {
		e.preventDefault();
		setSite( data );
		setPreview( true );
	};
	
	return (
		<div
			onMouseEnter={ showActions }
			onMouseLeave={ hideActions }
			className="card starter-site-card"
		>
			<div className="top">
				<div className={ 'actions ' + actionsClass }>
					<Button className="preview" onClick={ launchPreview }>
						{ __( 'Preview', 'codeless-starter-sites' ) }
					</Button>
					{ ( data.is_free || (cossDash.activeTheme) ) && (
						<Button className="import" onClick={ launchImport }>
							{ __( 'Import', 'codeless-starter-sites' ) }
						</Button>
					) }
				</div>
				{ data.screenshot && (
					<div
						className="image"
						style={ {
							backgroundImage: `url("${ data.screenshot }")`,
						} }
					/>
				) }
			</div>
			<div className="bottom">
				<p className="title">{ data.title }</p>
				{ !data.is_free && !cossDash.activeTheme && (
					<a href="https://codeless.co/purchase.php?theme=specular" class="premium-button" target="_blank"><span className="pro-badge">
						<Dashicon icon="lock" size={ 15 } />
						<span>
							{ __( 'Premium', 'codeless-starter-sites' ) }
						</span>
					</span></a>
				) }
			</div>
		</div>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getThemeAction } = select( 'codeless-ss' );

		return {
			themeStatus: getThemeAction().action || false,
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			setCurrentSite,
			setPreviewStatus,
			setImportModalStatus,
			setInstallModalStatus,
		} = dispatch( 'codeless-ss' );
		return {
			setSite: ( data ) => setCurrentSite( data ),
			setPreview: ( status ) => setPreviewStatus( status ),
			setModal: ( status ) => setImportModalStatus( status ),
			setInstallModal: ( status ) => setInstallModalStatus( status ),
		};
	} )
)( StarterSiteCard );
