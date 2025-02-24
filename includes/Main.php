<?php
/**
 * Theme Onboarding
 *
 * @package    codeless-starter-sites
 */

namespace COSS;

/**
 * Class Main
 */
class Main {
	/**
	 * The version of this library
	 *
	 * @var string Version string.
	 */
	const VERSION = '1.0.0';
	/**
	 * Sites Library API URL.
	 *
	 * @var string API root string.
	 */
	const API_ROOT = 'ti-sites-lib/v1';
	/**
	 * Storage for the remote fetched info.
	 *
	 * @var string Transient slug.
	 */
	const STORAGE_TRANSIENT = 'codeless_sites_library_data';
	/**
	 * Main
	 *
	 * @var Main
	 */
	protected static $instance = null;
	/**
	 * Admin
	 *
	 * @var Admin
	 */
	public $admin = null;

	/**
	 * Sites listing
	 *
	 * @var Sites_Listing
	 */
	private $sites_listing = null;

	/**
	 * Instantiate the class.
	 *
	 * @static
	 * @return Main
	 * @since  1.0.0
	 * @access public
	 */
	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
			self::$instance->init();
		}

		return self::$instance;
	}

	/**
	 * Holds the sites data.
	 *
	 * @var null
	 */
	private function init() {
		$this->setup_sites_listing();

		if ( ! $this->should_load() ) {
			return;
		}
		$this->setup_admin();
		$this->setup_api();
	}

	/**
	 * Utility to check if sites library should be loaded.
	 *
	 * @return bool
	 */
	private function should_load() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Setup sites listing.
	 *
	 * @return void
	 */
	private function setup_sites_listing() {
		$this->sites_listing = new Sites_Listing();
		$this->sites_listing->init();
	}

	/**
	 * Setup admin functionality.
	 *
	 * @return void
	 */
	private function setup_admin() {
		$this->admin = new Admin();
		$this->admin->init();
	}

	/**
	 * Setup the restful functionality.
	 *
	 *
	 * @return void
	 */
	private function setup_api() {
		$api = new Rest_Server();
		$api->init();
	}

	/**
	 * Disallow object clone
	 *
	 * @access public
	 * @return void
	 * @since  1.0.0
	 */
	public function __clone() {
	}

	/**
	 * Disable un-serializing
	 *
	 * @access public
	 * @return void
	 * @since  1.0.0
	 */
	public function __wakeup() {
	}
}
