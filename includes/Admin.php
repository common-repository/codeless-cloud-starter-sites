<?php
/**
 * Handles admin logic for the onboarding.
 *
 * @package    codeless-starter-sites
 */

namespace COSS;

/**
 * Class Admin
 *
 * @package codeless-starter-sites
 */
class Admin {

	/**
	 * Admin page slug
	 *
	 * @var string
	 */
	private $page_slug = 'codeless-starter-sites';

	/**
	 * White label config
	 *
	 * @var array
	 */
	private $wl_config = null;

	/**
	 * Initialize the Admin.
	 */
	public function init() {
		add_filter( 'query_vars', array( $this, 'add_onboarding_query_var' ) );
		add_filter( 'codeless_dashboard_page_data', array( $this, 'localize_sites_library' ) );
		add_action( 'admin_menu', array( $this, 'register' ) );
		add_action( 'admin_menu', array( $this, 'register' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue' ) );

		/*$white_label_module = get_option( 'nv_pro_white_label_status' );
		if ( ! empty( $white_label_module ) && (bool) $white_label_module === true ) {
			$branding = get_option( 'codeless_white_label_inputs' );
			if ( ! empty( $branding ) ) {
				$this->wl_config = json_decode( $branding, true );
			}
		}*/
	}

	/**
	 * Register theme options page.
	 *
	 * @return bool|void
	 */
	public function register() {
		if ( isset( $this->wl_config['starter_sites'] ) && (bool) $this->wl_config['starter_sites'] === true ) {
			return false;
		}

		$style = 'display:inline-block;';
		$parent = 'themes.php';
		if( isset( $specular_dashboard ) )
			$parent = 'specular_dashboard';
		add_submenu_page( $parent, __( 'Starter Sites', 'codeless-starter-sites' ), __( 'Starter Sites', 'codeless-starter-sites' ), 'activate_plugins', $this->page_slug, array( $this, 'render_starter_sites' ) );
		
	}

	/**
	 * Render method for the starter sites page.
	 */
	public function render_starter_sites() {
		echo '<div id="coss-app"/>';
	}

	public function enqueue() {
		$screen = get_current_screen();
		if ( ! isset( $screen->id ) ) {
			return;
		}
		
		if ( $screen->id !== 'appearance_page_' . $this->page_slug ) {
			return;
		}

		$dependencies = ( include COSS_PATH . 'assets/build/app.asset.php' );

		wp_register_style( 'tiob', COSS_URL . '/assets/build/style-app.css', array( 'wp-components' ), $dependencies['version'] );
		wp_style_add_data( 'tiob', 'rtl', 'replace' );
		wp_enqueue_style( 'tiob' );

		wp_register_script( 'tiob', COSS_URL . '/assets/build/app.js', array_merge( $dependencies['dependencies'], array( 'updates' ) ), $dependencies['version'], true );
		wp_localize_script( 'tiob', 'cossDash', apply_filters( 'codeless_dashboard_page_data', $this->get_localization() ) );
		wp_enqueue_script( 'tiob' );
	}

	/**
	 * Memorize the previous theme to later display the import template for it.
	 */
	public function get_previous_theme() {
		$previous_theme = strtolower( get_option( 'theme_switched' ) );
		set_theme_mod( 'codeless_prev_theme', $previous_theme );
	}

	/**
	 * Add our onboarding query var.
	 *
	 * @param array $vars_array the registered query vars.
	 *
	 * @return array
	 */
	public function add_onboarding_query_var( $vars_array ) {
		array_push( $vars_array, 'onboarding' );

		return $vars_array;
	}

	/**
	 * Localize the sites library.
	 *
	 * @param array $array the about page array.
	 *
	 * @return array
	 */
	public function localize_sites_library( $array ) {
		$api = array(
			'sites'      => $this->get_sites_data(),
			'root'       => esc_url_raw( rest_url( Main::API_ROOT ) ),
			'nonce'      => wp_create_nonce( 'wp_rest' ),
			'homeUrl'    => esc_url( home_url() ),
			'i18n'       => $this->get_strings(),
			'onboarding' => false,
			'logUrl'     => WP_Filesystem() ? Logger::get_instance()->get_log_url() : null,
		);

		$is_onboarding = isset( $_GET['onboarding'] ) && $_GET['onboarding'] === 'yes';
		if ( $is_onboarding ) {
			$api['onboarding'] = true;
		}

		$array['onboarding'] = $api;

		return $array;
	}

	/**
	 * Get all the sites data.
	 *
	 * @return array
	 */
	public function get_sites_data() {
		$theme_support = get_theme_support( 'codeless-demo-import' );
		if ( empty( $theme_support[0] ) || ! is_array( $theme_support[0] ) ) {
			return array();
		}
		$theme_support = $theme_support[0];
		$sites         = isset( $theme_support['remote'] ) ? $theme_support['remote'] : null;

		foreach ( $sites as $builder => $sites_for_builder ) {
			foreach ( $sites_for_builder as $slug => $data ) {
				$sites[ $builder ][ $slug ]['slug'] = $slug;
			}
		}

		return array(
			'sites'     => $sites,
		);
	}



	/**
	 * Get previous theme parent if it's a child theme.
	 *
	 * @param string $previous_theme Previous theme slug.
	 *
	 * @return string
	 */
	private function get_parent_theme( $previous_theme ) {
		$available_themes = wp_get_themes();
		if ( ! array_key_exists( $previous_theme, $available_themes ) ) {
			return false;
		}
		$theme_object = $available_themes[ $previous_theme ];

		return $theme_object->get( 'Template' );
	}


	/**
	 * Get strings.
	 *
	 * @return array
	 */
	private function get_strings() {
		return array(
			'preview_btn'                 => __( 'Preview', 'codeless-starter-sites' ),
			'import_btn'                  => __( 'Import', 'codeless-starter-sites' ),
			'pro_btn'                     => __( 'Get the PRO version!', 'codeless-starter-sites' ),
			'importing'                   => __( 'Importing', 'codeless-starter-sites' ),
			'cancel_btn'                  => __( 'Cancel', 'codeless-starter-sites' ),
			'loading'                     => __( 'Loading', 'codeless-starter-sites' ),
			'go_to_site'                  => __( 'View Website', 'codeless-starter-sites' ),
			'edit_template'               => __( 'Add your own content', 'codeless-starter-sites' ),
			'back'                        => __( 'Back to Sites Library', 'codeless-starter-sites' ),
			'note'                        => __( 'Note', 'codeless-starter-sites' ),
			'advanced_options'            => __( 'Advanced Options', 'codeless-starter-sites' ),
			'plugins'                     => __( 'Plugins', 'codeless-starter-sites' ),
			'general'                     => __( 'General', 'codeless-starter-sites' ),
			'later'                       => __( 'Keep current layout', 'codeless-starter-sites' ),
			'search'                      => __( 'Search', 'codeless-starter-sites' ),
			'content'                     => __( 'Content', 'codeless-starter-sites' ),
			'customizer'                  => __( 'Customizer', 'codeless-starter-sites' ),
			'widgets'                     => __( 'Widgets', 'codeless-starter-sites' ),
			'backup_disclaimer'           => __( 'We recommend you backup your website content before attempting a full site import.', 'codeless-starter-sites' ),
			'placeholders_disclaimer'     => __( 'Due to copyright issues, some of the demo images will not be imported and will be replaced by placeholder images.', 'codeless-starter-sites' ),
			'placeholders_disclaimer_new' => __( 'Some of the demo images will not be imported and will be replaced by placeholder images.', 'codeless-starter-sites' ),
			'unsplash_gallery_link'       => __( 'Here is our own collection of related images you can use for your site.', 'codeless-starter-sites' ),
			'import_done'                 => __( 'Content was successfully imported. Enjoy your new site!', 'codeless-starter-sites' ),
			'pro_demo'                    => __( 'Available in the PRO version', 'codeless-starter-sites' ),
			'copy_error_code'             => __( 'Copy error code', 'codeless-starter-sites' ),
			'download_error_log'          => __( 'Download error log', 'codeless-starter-sites' ),
			'external_plugins_notice'     => __( 'To import this demo you have to install the following plugins:', 'codeless-starter-sites' ),
			/* translators: 1 - 'here'. */
			'rest_not_working'            => sprintf(
				__( 'It seems that Rest API is not working properly on your website. Read about how you can fix it %1$s.', 'codeless-starter-sites' ),
				sprintf( '<a href="https://docs.codeless.co/article/1157-starter-sites-library-import-is-not-working#rest-api">%1$s<i class="dashicons dashicons-external"></i></a>', __( 'here', 'codeless-starter-sites' ) )
			),
			/* translators: 1 - 'get in touch'. */
			'error_report'                => sprintf(
				__( 'Hi! It seems there is a configuration issue with your server that\'s causing the import to fail. Please %1$s with us with the error code below, so we can help you fix this.', 'codeless-starter-sites' ),
				sprintf( '<a href="https://codeless.co/contact">%1$s <i class="dashicons dashicons-external"></i></a>', __( 'get in touch', 'codeless-starter-sites' ) )
			),
			/* translators: 1 - 'troubleshooting guide'. */
			'troubleshooting'             => sprintf(
				__( 'Hi! It seems there is a configuration issue with your server that\'s causing the import to fail. Take a look at our %1$s to see if any of the proposed solutions work.', 'codeless-starter-sites' ),
				sprintf( '<a href="https://docs.codeless.co/article/1157-starter-sites-library-import-is-not-working">%1$s <i class="dashicons dashicons-external"></i></a>', __( 'troubleshooting guide', 'codeless-starter-sites' ) )
			),
			/* translators: 1 - 'get in touch'. */
			'support'                     => sprintf(
				__( 'If none of the solutions in the guide work, please %1$s with us with the error code below, so we can help you fix this.', 'codeless-starter-sites' ),
				sprintf( '<a href="https://codeless.co/support">%1$s <i class="dashicons dashicons-external"></i></a>', __( 'get in touch', 'codeless-starter-sites' ) )
			),
			'fsDown'                      => sprintf(
				__( 'It seems that %s is not available. You can contact your site administrator or hosting provider to help you enable it.', 'codeless-starter-sites' ),
				sprintf( '<code>WP_Filesystem</code>' )
			),
		);
	}

	/**
	 * Get localization data for the dashboard script.
	 *
	 * @return array
	 */
	private function get_localization() {
		$theme_name = apply_filters( 'coss_theme_name', 'Specular' );
		$active_theme = get_option( 'specular_purchase_info' );
		if( is_array( $active_theme ) && isset( $active_theme['purchase_code'] ) && !empty( $active_theme['purchase_code'] ) )
			$active_theme = true;
		else
			$active_theme = false;

		return array(
			'nonce'         => wp_create_nonce( 'wp_rest' ),
			'assets'        => COSS_URL . '/assets/',
			'upgradeURL'    => esc_url( apply_filters( 'codeless_upgrade_link_from_child_theme_filter', 'https://codeless.co/specular' ) ),
			'strings'       => array(
				/* translators: %s - Theme name */
				'starterSitesTabDescription' => sprintf( __( 'With Codeless Starter Sites, you can choose from multiple unique demos, that can be installed with a single click. Just need to choose your favorite, and we will take care of everything else. All content will be installed with one-click', 'codeless-starter-sites' ), wp_kses_post( $theme_name ) ),
			),
			'onboarding'    => array(),
			'hasFileSystem' => WP_Filesystem(),
			'themesURL'     => admin_url( 'themes.php' ),
			'adminURL'		=> admin_url(),
			'activeTheme' 	=> $active_theme,
			'themeAction'   => $this->get_theme_action(),
			'brandedTheme'  => isset( $this->wl_config['theme_name'] ) ? $this->wl_config['theme_name'] : false,
		);
	}

	/**
	 * Gets theme action.
	 */
	private function get_theme_action() {
		if ( defined( 'NEVE_VERSION' ) ) {
			return false;
		}

		$themes = wp_get_themes();
		foreach ( $themes as $theme_slug => $args ) {
			$theme = wp_get_theme( $theme_slug );
			if ( $theme->get( 'TextDomain' ) === 'specular' ) {
				return array(
					'action' => 'activate',
					'slug'   => $theme_slug,
					'nonce'  => wp_create_nonce( 'switch-theme_' . $theme_slug ),
				);
			}
		}
		return array(
			'action' => 'install',
			'slug'   => 'specular',
			'nonce'  => wp_create_nonce( 'switch-theme_specular' ),
		);
	}
}
