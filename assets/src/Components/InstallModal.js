/* global cossDash */

import { Button, Modal } from '@wordpress/components';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { get } from '../utils/rest';

const InstallModal = ( {
	setImportModal,
	setInstallModal,
	themeData,
	setThemeAction,
} ) => {
	const { action, slug, nonce } = themeData;
	const { themesURL, brandedTheme } = cossDash;
	const [ installing, setInstalling ] = useState( false );
	const [ error, setError ] = useState( null );
	const handleDismiss = () => {
		setInstallModal( false );
	};

	const handleError = ( message ) => {
		setInstalling( false );
		setError(
			sprintf(
				// translators: %s: Error message.
				__(
					'An error has ocurred: %s',
					'codeless-starter-sites'
				),
				message
			)
		);
	};

	const handleInstall = () => {
		setInstalling( 'installing' );
		wp.updates.installTheme( {
			slug: 'specular',
			success: () => {
				setThemeAction( { ...themeData, action: 'activate' } );
				handleActivate();
			},
			error: ( err ) => {
				setThemeAction( { ...themeData, action: 'activate' } );
				handleError(
					err.errorMessage ||
						__(
							'Could not install theme.',
							'codeless-starter-sites'
						)
				);
			},
		} );
	};

	const handleActivate = () => {
		setInstalling( 'activating' );
		const url = `${ themesURL }?action=activate&stylesheet=${ slug }&_wpnonce=${ nonce }`;
		get( url, true ).then( ( response ) => {
			if ( response.status !== 200 ) {
				handleError(
					__(
						'Could not activate theme.',
						'codeless-starter-sites'
					)
				);
				setInstalling( false );
				return false;
			}
			setInstalling( false );
			setInstallModal( false );
			setThemeAction( false );
			setImportModal( true );
		} );
	};


	return (
		<Modal
			className="ob-import-modal install-modal"
			title={ __(
				'Activate Specular',
				'codeless-starter-sites'
			) }
			onRequestClose={ handleDismiss }
			shouldCloseOnClickOutside={ ! installing }
			isDismissible={ ! installing }
		>
			<div className="modal-body" style={ { textAlign: 'center' } }>
				{ ! brandedTheme && (
					<img
						style={ { width: 60 } }
						src={ `${ cossDash.assets }/img/logo-codeless.png` }
						alt={ __( 'Logo', 'codeless-starter-sites' ) }
					/>
				) }
				{ error && (
					<div className="well error" style={ { margin: '20px 0' } }>
						{ error }
					</div>
				) }
				<p
					style={ {
						lineHeight: 1.6,
						fontSize: '15px',
					} }
				>
					{ __(
						'In order to import the starter site, Specular theme should be activated. Please click below and enter purchase code.',
						'codeless-starter-sites'
					) }
				</p>
			</div>
			<div
				className="modal-footer"
				style={ { justifyContent: 'center' } }
			>
				<div className="actions" style={ { display: 'flex' } }>
					{ ! error && (
						<Button
							dismiss={ error }
							isPrimary
							disabled={ installing }
							className={ installing && 'is-loading' }
							icon={ installing && 'update' }
							onClick={(e) => {
								e.preventDefault();
								window.location.href=cossDash.adminURL + 'admin.php?page=specular_dashboard';
								}}
						>
							{ __(
											'Activate Licence',
											'codeless-starter-sites'
									  ) }
						</Button>
					) }
					<Button
						isSecondary
						disabled={ installing }
						onClick={ handleDismiss }
					>
						{ __( 'Close', 'codeless-starter-sites' ) }
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getThemeAction } = select( 'codeless-ss' );

		return {
			themeData: getThemeAction() || false,
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			setImportModalStatus,
			setInstallModalStatus,
			setThemeAction,
		} = dispatch( 'codeless-ss' );
		return {
			setImportModal: ( status ) => setImportModalStatus( status ),
			setInstallModal: ( status ) => setInstallModalStatus( status ),
			setThemeAction: ( status ) => setThemeAction( status ),
		};
	} )
)( InstallModal );
