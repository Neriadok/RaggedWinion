<?php

/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
namespace Symfony\Component\Translation;

/**
 * IdentityTranslator does not translate anything.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 *        
 *         @api
 */
class IdentityTranslator implements TranslatorInterface {
	private $selector;
	private $locale;
	
	/**
	 * Constructor.
	 *
	 * @param MessageSelector|null $selector
	 *        	The message selector for pluralization
	 *        	
	 *        	@api
	 */
	public function __construct(MessageSelector $selector = null) {
		$this->selector = $selector ?  : new MessageSelector ();
	}
	
	/**
	 *
	 * @ERROR!!! @api
	 */
	public function setLocale($locale) {
		$this->locale = $locale;
	}
	
	/**
	 *
	 * @ERROR!!! @api
	 */
	public function getLocale() {
		return $this->locale ?  : \Locale::getDefault ();
	}
	
	/**
	 *
	 * @ERROR!!! @api
	 */
	public function trans($id, array $parameters = array(), $domain = null, $locale = null) {
		return strtr ( ( string ) $id, $parameters );
	}
	
	/**
	 *
	 * @ERROR!!! @api
	 */
	public function transChoice($id, $number, array $parameters = array(), $domain = null, $locale = null) {
		return strtr ( $this->selector->choose ( ( string ) $id, ( int ) $number, $locale ?  : $this->getLocale () ), $parameters );
	}
}
