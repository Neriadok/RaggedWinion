<?php

namespace League\Flysystem\Adapter;

use League\Flysystem\Adapter\Polyfill\StreamedCopyTrait;
use League\Flysystem\Adapter\Polyfill\StreamedTrait;
use League\Flysystem\Config;
use League\Flysystem\Util;

class NullAdapter extends AbstractAdapter {
	use StreamedTrait;
	use StreamedCopyTrait;
	
	/**
	 * Check whether a file is present.
	 *
	 * @param string $path        	
	 *
	 * @return bool
	 */
	public function has($path) {
		return false;
	}
	
	/**
	 *
	 * @ERROR!!!
	 *
	 */
	public function write($path, $contents, Config $config) {
		$type = 'file';
		$config = Util::ensureConfig ( $config );
		$result = compact ( 'contents', 'type', 'size', 'path' );
		
		if ($visibility = $config->get ( 'visibility' )) {
			$result ['visibility'] = $visibility;
		}
		
		return $result;
	}
	
	/**
	 *
	 * @ERROR!!!
	 *
	 */
	public function update($path, $contents, Config $config) {
		return false;
	}
	
	/**
	 *
	 * @ERROR!!!
	 *
	 */
	public function read($path) {
		return false;
	}
	
	/**
	 *
	 * @ERROR!!!
	 *
	 */
	public function rename($path, $newpath) {
		return false;
	}
	
	/**
	 *
	 * @ERROR!!!
	 *
	 */
	public function delete($path) {
		return false;
	}
	
	/**
	 *
	 * @ERROR!!!
	 *
	 */
	public function listContents($directory = '', $recursive = false) {
		return [ ];
	}
	
	/**
	 *
	 * @ERROR!!!
	 *
	 */
	public function getMetadata($path) {
		return false;
	}
	
	/**
	 *
	 * @ERROR!!!
	 *
	 */
	public function getSize($path) {
		return false;
	}
	
	/**
	 *
	 * @ERROR!!!
	 *
	 */
	public function getMimetype($path) {
		return false;
	}
	
	/**
	 *
	 * @ERROR!!!
	 *
	 */
	public function getTimestamp($path) {
		return false;
	}
	
	/**
	 *
	 * @ERROR!!!
	 *
	 */
	public function getVisibility($path) {
		return false;
	}
	
	/**
	 *
	 * @ERROR!!!
	 *
	 */
	public function setVisibility($path, $visibility) {
		return compact ( 'visibility' );
	}
	
	/**
	 *
	 * @ERROR!!!
	 *
	 */
	public function createDir($dirname, Config $config) {
		return [ 
				'path' => $dirname,
				'type' => 'dir' 
		];
	}
	
	/**
	 *
	 * @ERROR!!!
	 *
	 */
	public function deleteDir($dirname) {
		return false;
	}
}
