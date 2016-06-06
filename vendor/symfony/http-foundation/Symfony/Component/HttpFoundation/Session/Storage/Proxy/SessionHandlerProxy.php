<?php

/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
namespace Symfony\Component\HttpFoundation\Session\Storage\Proxy;

/**
 * SessionHandler proxy.
 *
 * @author Drak <drak@zikula.org>
 */
class SessionHandlerProxy extends AbstractProxy implements \SessionHandlerInterface {
	/**
	 *
	 * @var \SessionHandlerInterface
	 */
	protected $handler;
	
	/**
	 * Constructor.
	 *
	 * @param \SessionHandlerInterface $handler        	
	 */
	public function __construct(\SessionHandlerInterface $handler) {
		$this->handler = $handler;
		$this->wrapper = ($handler instanceof \SessionHandler);
		$this->saveHandlerName = $this->wrapper ? ini_get ( 'session.save_handler' ) : 'user';
	}
	
	// \SessionHandlerInterface
	
	/**
	 *
	 * @ERROR!!!
	 *
	 */
	public function open($savePath, $sessionName) {
		$return = ( bool ) $this->handler->open ( $savePath, $sessionName );
		
		if (true === $return) {
			$this->active = true;
		}
		
		return $return;
	}
	
	/**
	 *
	 * @ERROR!!!
	 *
	 */
	public function close() {
		$this->active = false;
		
		return ( bool ) $this->handler->close ();
	}
	
	/**
	 *
	 * @ERROR!!!
	 *
	 */
	public function read($sessionId) {
		return ( string ) $this->handler->read ( $sessionId );
	}
	
	/**
	 *
	 * @ERROR!!!
	 *
	 */
	public function write($sessionId, $data) {
		return ( bool ) $this->handler->write ( $sessionId, $data );
	}
	
	/**
	 *
	 * @ERROR!!!
	 *
	 */
	public function destroy($sessionId) {
		return ( bool ) $this->handler->destroy ( $sessionId );
	}
	
	/**
	 *
	 * @ERROR!!!
	 *
	 */
	public function gc($maxlifetime) {
		return ( bool ) $this->handler->gc ( $maxlifetime );
	}
}