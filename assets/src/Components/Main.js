import Search from './Search';
import StarterSiteCard from './StarterSiteCard';
import PreviewFrame from './PreviewFrame';
import ImportModal from './ImportModal';
import InstallModal from './InstallModal';
import Migration from './Migration';
import VizSensor from 'react-visibility-sensor';
import Fuse from 'fuse.js/dist/fuse.min';
import EditorTabs from './EditorTabs';
import EditorSelector from './EditorSelector';

import { useState, Fragment } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';

const Onboarding = ( {
	editor,
	category,
	resetCategory,
	previewOpen,
	currentSiteData,
	importModal,
	isOnboarding,
	cancelOnboarding,
	getSites,
	installModal,
} ) => {
	const [ searchQuery, setSearchQuery ] = useState( '' );
	const [ maxShown, setMaxShown ] = useState( 9 );
	const { sites = {}, migration } = getSites;
	const [ sticky, setSticky ] = useState( false );
	console.log(sites);
	if ( 1 > sites.length ) {
		return (
			<>
				<p>
					{ __(
						'Starter sites could not be loaded. Please refresh and try again.',
						'codeless-starter-sites'
					) }
					{ isOnboarding && (
						<Button
							style={ {
								display: 'block',
								margin: '20px auto',
							} }
							isPrimary
							onClick={ cancelOnboarding }
						>
							{ __( 'Close', 'codeless-starter-sites' ) }
						</Button>
					) }
				</p>
			</>
		);
	}

	const tags = [
		__( 'Business', 'codeless-starter-sites' ),
		__( 'Ecommerce', 'codeless-starter-sites' ),
		__( 'Fashion', 'codeless-starter-sites' ),
		__( 'Blogging', 'codeless-starter-sites' ),
		__( 'Photography', 'codeless-starter-sites' ),
	];

	const CATEGORIES = {
		all: __( 'All Categories' ),
		business: __( 'Business' ),
		portfolio: __( 'Portfolio' ),
		woocommerce: __( 'WooCommerce' ),
		blog: __( 'Blog' ),
		personal: __( 'Personal' ),
		other: __( 'Other' ),
	};

	const EDITOR_MAP = {
		gutenberg: {
			icon: 'gutenberg.jpg',
			niceName: 'Gutenberg',
		},
		elementor: {
			icon: 'elementor.jpg',
			niceName: 'Elementor',
		},
		wpbakery: {
			icon: 'wpbakery.jpg',
			niceName: 'WPBakery',
		},
		'beaver builder': {
			icon: 'beaver.jpg',
			niceName: (
				<>
					Beaver <span className="long-name">Builder</span>
				</>
			),
		},
		brizy: {
			icon: 'brizy.jpg',
			niceName: 'Brizy',
		},
		
		'divi builder': {
			icon: 'divi.jpg',
			niceName: 'Divi',
		},
		'thrive architect': {
			icon: 'thrive.jpg',
			niceName: (
				<>
					Thrive <span className="long-name">Architect</span>
				</>
			),
		},
	};

	const getAllSites = () => {
		const finalData = {};
		const builders = getBuilders();
		
		builders.map( ( builder ) => {
			const sitesData = sites && sites[ builder ] ? sites[ builder ] : {};
			finalData[ builder ] = [ ...Object.values( sitesData ) ];
		} );

		return finalData;
	};

	const filterByCategory = ( sites, category ) => {
		if ( 'free' === category ) {
			return sites.filter( ( item ) => ! item.upsell );
		}

		if ( 'all' !== category ) {
			return sites.filter( ( item ) =>
				item.keywords.includes( category )
			);
		}

		return sites;
	};

	const filterBySearch = ( sites ) => {
		if ( ! searchQuery ) {
			return sites;
		}

		const fuse = new Fuse( sites, {
			includeScore: true,
			keys: [ 'title', 'slug', 'keywords' ],
		} );
		return fuse.search( searchQuery ).map( ( item ) => item.item );
	};

	const getSitesForBuilder = ( builder ) => {
		const allSites = getAllSites();
		return allSites[ builder ];
	};

	const getBuilders = () => Object.keys( sites );

	const getCounts = () => {
		const counts = {
			builders: {},
			categories: {},
		};
		const builders = getBuilders();

		builders.map( ( builder ) => {
			let buildersFiltered = getSitesForBuilder( builder );
			buildersFiltered = filterByCategory( buildersFiltered, category );
			buildersFiltered = filterBySearch( buildersFiltered );
			counts.builders[ builder ] = buildersFiltered
				? buildersFiltered.length
				: 0;
		} );

		Object.keys( CATEGORIES ).map( ( category ) => {
			let categoriesFiltered = getSitesForBuilder( editor );
			categoriesFiltered = filterByCategory(
				categoriesFiltered,
				category
			);
			categoriesFiltered = filterBySearch( categoriesFiltered );
			counts.categories[ category ] = categoriesFiltered
				? categoriesFiltered.length
				: 0;
		} );

		return counts;
	};

	const getFilteredSites = () => {
		const allSites = getAllSites();
		let builderSites = allSites[ editor ];
		builderSites = filterBySearch( builderSites );
		builderSites = filterByCategory( builderSites, category );

		return builderSites;
	};

	const renderSites = () => {
		const allData = getFilteredSites();
		return allData.slice( 0, maxShown ).map( ( site, index ) => {
			return <StarterSiteCard key={ index } data={ site } />;
		} );
	};

	const getSiteNav = ( prev = false ) => {
		if ( null === currentSiteData ) {
			return null;
		}
		const allSites = getAllSites()[ editor ];
		const position = allSites.indexOf( currentSiteData );

		if ( -1 === position ) {
			return null;
		}

		if ( 1 === allSites.length ) {
			return null;
		}

		if ( prev && 0 === position ) {
			return allSites[ allSites.length - 1 ];
		}

		if ( ! prev && position === allSites.length - 1 ) {
			return allSites[ 0 ];
		}

		return allSites[ prev ? position - 1 : position + 1 ];
	};

	function renderMigration() {
		if ( ! migration ) {
			return null;
		}
		return <Migration data={ migration } />;
	}

	const onlyProBuilders = getBuilders().filter( ( builder ) => {
		const upsellSitesCount = Object.keys( sites[ builder ] ).filter(
			( site ) => true === sites[ builder ][ site ].upsell
		).length;
		const sitesCount = Object.keys( sites[ builder ] ).length;

		return upsellSitesCount === sitesCount;
	} );

	const counted = getCounts();

	return (
		<Fragment>
			<div className="ob">
				{ sticky && ! isOnboarding && (
					<div className="sticky-nav">
						<div className="container sticky-nav-content">
							{ ! cossDash.brandedTheme && (
								<img
									src={ `${ cossDash.assets }img/logo-codeless.png` }
									alt="Logo"
									width="60"
								/>
							) }
							<Search
								count={ counted.categories }
								categories={ CATEGORIES }
								onSearch={ ( query ) => {
									setSearchQuery( query );
									setMaxShown( 9 );
								} }
								query={ searchQuery }
							/>
							<EditorSelector
								isSmall
								count={ counted.builders }
								EDITOR_MAP={ EDITOR_MAP }
							/>
						</div>
					</div>
				) }
				{ renderMigration() }
				<div className="ob-head">
					{ ! isOnboarding && (
						<>
							<h2>
								{ ! cossDash.brandedTheme && (
									<img
										src={ `${ cossDash.assets }img/logo-codeless.png` }
										alt="Logo"
										width="60"
									/>
								) }
								<span>
									{ __(
										'Ready to use pre-built websites with 1-click installation',
										'codeless-starter-sites'
									) }
								</span>
							</h2>
							<p>
								{ cossDash.strings.starterSitesTabDescription }
							</p>
						</>
					) }
					{ isOnboarding && (
						<Button
							className="close-onboarding"
							isLink
							icon="no-alt"
							onClick={ cancelOnboarding }
						/>
					) }
				</div>

				<div className="ob-body">
					<VizSensor
						onChange={ ( isVisible ) => {
							if ( ! isVisible ) {
								setSticky( true );
							} else {
								setSticky( false );
							}
						} }
					>
						<div>
							<EditorSelector
								count={ counted.builders }
								EDITOR_MAP={ EDITOR_MAP }
							/>
							<Search
								count={ counted.categories }
								categories={ CATEGORIES }
								onSearch={ ( query ) => {
									setSearchQuery( query );
									setMaxShown( 9 );
								} }
								query={ searchQuery }
							/>
							<EditorTabs
								EDITOR_MAP={ EDITOR_MAP }
								onlyProSites={ onlyProBuilders }
								count={ counted.builders }
							/>
						</div>
					</VizSensor>
					{ 0 === getFilteredSites().length ? (
						<div className="no-results">
							<p>
								{ __(
									'No results found',
									'codeless-starter-sites'
								) }
								.{ ' ' }
								{ __(
									'You can try a different search or use one of the categories below.',
									'codeless-starter-sites'
								) }
							</p>
							<div className="tags">
								{ tags.map( ( tag, index ) => {
									return (
										<Button
											key={ index }
											isPrimary
											className="tag"
											onClick={ ( e ) => {
												e.preventDefault();
												setSearchQuery( tag );
												resetCategory();
											} }
										>
											{ tag }
										</Button>
									);
								} ) }
							</div>
						</div>
					) : (
						<div className="ob-sites">{ renderSites() }</div>
					) }
					<VizSensor
						onChange={ ( isVisible ) => {
							if ( ! isVisible ) {
								return false;
							}
							setMaxShown( maxShown + 9 );
						} }
					>
						<span
							style={ {
								height: 10,
								width: 10,
								display: 'block',
							} }
						/>
					</VizSensor>
				</div>
			</div>
			{ previewOpen && currentSiteData && (
				<PreviewFrame
					next={ getSiteNav() }
					prev={ getSiteNav( true ) }
				/>
			) }
			{ importModal && currentSiteData && <ImportModal /> }
			{ installModal && <InstallModal /> }
		</Fragment>
	);
};

export default compose(
	withDispatch( ( dispatch ) => {
		const { setOnboardingState, setCurrentCategory } = dispatch(
			'codeless-ss'
		);
		return {
			cancelOnboarding: () => {
				setOnboardingState( false );
			},
			resetCategory: () => {
				setCurrentCategory( 'all' );
			},
		};
	} ),
	withSelect( ( select ) => {
		const {
			getCurrentEditor,
			getCurrentCategory,
			getPreviewStatus,
			getCurrentSite,
			getImportModalStatus,
			getOnboardingStatus,
			getSites,
			getInstallModalStatus,
		} = select( 'codeless-ss' );
		return {
			editor: getCurrentEditor(),
			category: getCurrentCategory(),
			previewOpen: getPreviewStatus(),
			currentSiteData: getCurrentSite(),
			importModal: getImportModalStatus(),
			installModal: getInstallModalStatus(),
			isOnboarding: getOnboardingStatus(),
			getSites: getSites(),
		};
	} )
)( Onboarding );
