<?php
/**
 * The plugin upgrader quiet skin.
 *
 * Used to silence installation progress for plugins installs.
 *
 * @package    codeless-starter-sites
 */

namespace COSS\Importers\Helpers;

use WP_Upgrader_Skin;

/**
 * Class Quiet_Skin
 *
 * Silences plugin install and activate.
 */
class Quiet_Skin extends WP_Upgrader_Skin {
	/**
	 * Done Header.
	 *
	 * @var bool
	 */
	public $done_header = true;

	/**
	 * Done Footer.
	 *
	 * @var bool
	 */
	public $done_footer = true;

	/**
	 * Feedback function overwrite.
	 *
	 * @param string $string feedback string.
	 * @param mixed ...$args feedback args.
	 */
	public function feedback( $string, ...$args ) {
		// Keep install quiet.
	}

	/**
	 * Quiet after.
	 */
	public function after() {
		// Quiet after
	}

	/**
	 * Quiet before.
	 */
	public function before() {
		// Quiet before.
	}


}
