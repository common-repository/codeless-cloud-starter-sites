/* global cossDash */
import { send } from '../utils/rest';
import { installPlugins } from '../utils/site-import';
import ImportModalNote from './ImportModalNote';
import ImportModalError from './ImportModalError';

import { __ } from '@wordpress/i18n';
import { Dashicon, Button, Modal } from '@wordpress/components';
import { useState, Fragment } from '@wordpress/element';

const Migration = ( { data } ) => {
	const setToast = ( string ) => console.log( string );
	const [ dismissed, setDismissed ] = useState( false );
	const [ modalOpen, setModalOpen ] = useState( false );
	const [ migrating, setMigrating ] = useState( false );
	const [ error, setError ] = useState( null );
	const [ frontPageID, setFrontPageID ] = useState( null );

	if ( dismissed ) {
		return null;
	}

	const closeModal = () => {
		if ( 'done' === migrating ) {
			setDismissed( true );
		}
		setModalOpen( false );
		setError( null );
		setMigrating( false );
	};

	function startMigration() {
		const plugins = Object.keys( data.mandatory_plugins ).reduce( function (
			p,
			key
		) {
			p[ key ] = true;
			return p;
		},
		{} );

		installPlugins( plugins ).then( ( r ) => {
			setMigrating( true );
			if ( ! r.success ) {
				setError( {
					code: r.data || null,
					message: __(
						'Something went wrong while installing the necessary plugins.',
						'codeless'
					),
				} );
				setMigrating( false );
				return false;
			}
			const { template, template_name } = data;
			send( cossDash.onboarding.root + '/migrate_frontpage', {
				template,
				template_name,
			} ).then( ( r ) => {
				if ( ! r.success ) {
					setError( {
						code: r.data || null,
						message: __(
							'Something went wrong while importing the website content.',
							'codeless'
						),
					} );
					setMigrating( false );
					return false;
				}
				setFrontPageID( r.data );
				setMigrating( 'done' );
			} );
		} );
	}

	const renderModal = () => {
		return (
			<Modal
				className="ob-import-modal migration"
				title={
					__( 'Migrate', 'codeless-starter-sites' ) +
					' ' +
					data.theme_name
				}
				onRequestClose={ closeModal }
				shouldCloseOnClickOutside={ ! migrating }
				isDismissible={ ! migrating }
			>
				<Fragment>
					<div className="modal-body">
						{ error && (
							<ImportModalError
								message={ error.message || null }
								code={ error.code || null }
							/>
						) }
						{ false === migrating && ! error && (
							<Fragment>
								<ImportModalNote data={ data } />
								{ data.mandatory_plugins && (
									<Fragment>
										<hr />
										<h3>
											{ __(
												'The following plugins will be installed',
												'codeless'
											) }
											:
										</h3>
										<ul>
											{ Object.keys(
												data.mandatory_plugins
											).map( ( k, index ) => (
												<li key={ index }>
													-{ ' ' }
													{
														data.mandatory_plugins[
															k
														]
													}
												</li>
											) ) }
										</ul>
									</Fragment>
								) }
							</Fragment>
						) }
						{ 'done' === migrating && (
							<p className="import-result">
								{ __(
									'Content was successfully imported. Enjoy your new site!',
									'codeless'
								) }
							</p>
						) }
						{ true === migrating && (
							<div className="loading">
								<Dashicon icon="update" size={ 50 } />
								<h3>
									{ __(
										'Migrating',
										'codeless-starter-sites'
									) }
									...
								</h3>
							</div>
						) }
					</div>
					{ ( ! migrating || 'done' === migrating ) && (
						<div className="modal-footer">
							<Button
								isSecondary={ 'done' !== migrating }
								isLink={ 'done' === migrating }
								className={
									'done' === migrating ? 'close' : null
								}
								onClick={ closeModal }
							>
								{ 'done' === migrating
									? __(
											'Close',
											'codeless-starter-sites'
									  )
									: __(
											'Cancel',
											'codeless-starter-sites'
									  ) }
							</Button>
							{ ! error && 'done' !== migrating ? (
								<Button
									isPrimary
									onClick={ () => {
										startMigration();
									} }
								>
									{ __(
										'Start Migration',
										'codeless-starter-sites'
									) }
								</Button>
							) : (
								<Fragment>
									<Button
										isSecondary
										href={ `${ cossDash.onboarding.homeUrl }/wp-admin/post.php?post=${ frontPageID }&action=elementor` }
									>
										{ __(
											'Edit Content',
											'codeless-starter-sites'
										) }
									</Button>
									<Button
										isPrimary
										href={ cossDash.onboarding.homeUrl }
									>
										{ __(
											'View Website',
											'codeless-starter-sites'
										) }
									</Button>
								</Fragment>
							) }
						</div>
					) }
				</Fragment>
			</Modal>
		);
	};

	return (
		<div className="ob-migration">
			{ modalOpen && renderModal() }
			<h2>{ data.heading }</h2>
			<p>{ data.description }</p>
			<div className="card starter-site-card">
				<div className="top">
					{ data.screenshot && (
						<div className="image">
							<img
								src={ data.screenshot }
								alt={ data.theme_name }
							/>
						</div>
					) }
				</div>
				<div className="bottom">
					<p className="title">{ data.theme_name }</p>
				</div>
			</div>
			<div className="actions">
				<Button
					isPrimary
					onClick={ () => {
						setModalOpen( true );
						return false;
					} }
				>
					{ __( 'Migrate', 'codeless-starter-sites' ) +
						' ' +
						data.theme_name }
				</Button>
				<Button
					isSecondary
					onClick={ () => {
						send( cossDash.onboarding.root + '/dismiss_migration', {
							theme_mod: data.theme_mod,
						} ).then( ( r ) => {
							if ( ! r.success ) {
								setToast(
									__(
										'Something went wrong. Please reload the page and try again.',
										'codeless'
									)
								);
								return false;
							}
							setToast(
								__(
									'Dismissed',
									'codeless-starter-sites'
								)
							);
							setDismissed( true );
						} );
					} }
				>
					{ __( 'Dismiss', 'codeless-starter-sites' ) }
				</Button>
			</div>
		</div>
	);
};
export default Migration;
