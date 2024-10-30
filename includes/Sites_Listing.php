<?php
/**
 * Theme Onboarding Sites_Listing
 *
 * @package    codeless-starter-sites
 */

namespace COSS;

/**
 * Class Sites_Listing
 */
class Sites_Listing {

	/**
	 * Sites Listing API URL
	 */
	const API = 'https://api.codeless.co/wp-json/codeless-api/v1/sites'; 

	/**
	 * Key of transient where we save the sites list.
	 *
	 * @var string
	 */
	private $transient_key = 'codeless_starter_sites';

	/**
	 * The sites config.
	 *
	 * @var array
	 */
	private $sites_config = array();

	/**
	 * Initialize the Class.
	 */
	public function init() {
		$this->sites_config = array(
			'remote'      => $this->get_sites()
		);
		$this->add_sites_library_support();
	}

	/**
	 *
	 */
	public function add_sites_library_support() {
		add_theme_support( 'codeless-demo-import', $this->get_codeless_demo_content_support_data() );
	}

	private function get_sites() {
		
		$cache = get_transient( $this->transient_key );
		

		if ( $cache !== false ) {
			$response = $cache;
		} else {
			
			$response = wp_remote_get( esc_url( self::API ), array(
				'headers' => array("cache-control" => "no-store, no-cache, must-revalidate, post-check=0, pre-check=0")
			) );

			if ( is_wp_error( $response ) || wp_remote_retrieve_response_code( $response ) !== 200 ) {
				return array();
			}

			$response = wp_remote_retrieve_body( $response );

			$response = json_decode( $response, true );

			if ( ! is_array( $response ) || empty( $response ) ) {
				return array();
			}
		}

		require_once( ABSPATH . 'wp-admin/includes/plugin.php' );

		set_transient( $this->transient_key, $response, 12 * HOUR_IN_SECONDS );

		return $response;
	}

	/**
	 * Get the codeless demo content support data.
	 *
	 * @return array
	 */
	private function get_codeless_demo_content_support_data() {
		return apply_filters( 'codeless_filter_starter_sites', $this->sites_config );
	}

}
