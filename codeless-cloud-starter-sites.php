<?php
/**
 * Plugin Name:       Codeless Cloud Starter Sites
 * Description:       Starter sites and templates for Elementor Gutenberg and WPBakery.
 * Version:           1.0.1
 * Author:            codelessthemes
 * Author URI:        https://codeless.co
 * License:           GPLv3
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.en.html
 * Text Domain:       codeless-starter-sites
 * Domain Path:       /languages
 * WordPress Available:  yes
 * Requires License:    no
 *
 * @package codeless-starter-sites
 */

//add_action( 'admin_notices', 'coss_plugins_page_notice' );
add_action( 'init', 'coss_load_textdomain' );


/**
 * Load the localisation file.
 */
function coss_load_textdomain() {
	load_plugin_textdomain( 'codeless-starter-sites', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
}

add_action( 'init', 'coss_run' );

function coss_run() {
	
	define( 'COSS_URL', plugin_dir_url( __FILE__ ) );
	define( 'COSS_PATH', dirname( __FILE__ ) . '/' );

	$autoload_path = __DIR__ . '/vendor/autoload.php';
	if ( is_file( $autoload_path ) ) {
		require_once $autoload_path;
	}


	\COSS\Main::instance();
}



