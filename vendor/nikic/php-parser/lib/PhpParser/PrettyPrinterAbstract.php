<?php

namespace PhpParser;

use PhpParser\Node\Expr;
use PhpParser\Node\Stmt;

abstract class PrettyPrinterAbstract {
	protected $precedenceMap = array (
			// [precedence, associativity] where for the latter -1 is %left, 0 is %nonassoc and 1 is %right
			'Expr_BinaryOp_Pow' => array (
					0,
					1 
			),
			'Expr_BitwiseNot' => array (
					1,
					1 
			),
			'Expr_PreInc' => array (
					1,
					1 
			),
			'Expr_PreDec' => array (
					1,
					1 
			),
			'Expr_PostInc' => array (
					1,
					- 1 
			),
			'Expr_PostDec' => array (
					1,
					- 1 
			),
			'Expr_UnaryPlus' => array (
					1,
					1 
			),
			'Expr_UnaryMinus' => array (
					1,
					1 
			),
			'Expr_Cast_Int' => array (
					1,
					1 
			),
			'Expr_Cast_Double' => array (
					1,
					1 
			),
			'Expr_Cast_String' => array (
					1,
					1 
			),
			'Expr_Cast_Array' => array (
					1,
					1 
			),
			'Expr_Cast_Object' => array (
					1,
					1 
			),
			'Expr_Cast_Bool' => array (
					1,
					1 
			),
			'Expr_Cast_Unset' => array (
					1,
					1 
			),
			'Expr_ErrorSuppress' => array (
					1,
					1 
			),
			'Expr_Instanceof' => array (
					2,
					0 
			),
			'Expr_BooleanNot' => array (
					3,
					1 
			),
			'Expr_BinaryOp_Mul' => array (
					4,
					- 1 
			),
			'Expr_BinaryOp_Div' => array (
					4,
					- 1 
			),
			'Expr_BinaryOp_Mod' => array (
					4,
					- 1 
			),
			'Expr_BinaryOp_Plus' => array (
					5,
					- 1 
			),
			'Expr_BinaryOp_Minus' => array (
					5,
					- 1 
			),
			'Expr_BinaryOp_Concat' => array (
					5,
					- 1 
			),
			'Expr_BinaryOp_ShiftLeft' => array (
					6,
					- 1 
			),
			'Expr_BinaryOp_ShiftRight' => array (
					6,
					- 1 
			),
			'Expr_BinaryOp_Smaller' => array (
					7,
					0 
			),
			'Expr_BinaryOp_SmallerOrEqual' => array (
					7,
					0 
			),
			'Expr_BinaryOp_Greater' => array (
					7,
					0 
			),
			'Expr_BinaryOp_GreaterOrEqual' => array (
					7,
					0 
			),
			'Expr_BinaryOp_Equal' => array (
					8,
					0 
			),
			'Expr_BinaryOp_NotEqual' => array (
					8,
					0 
			),
			'Expr_BinaryOp_Identical' => array (
					8,
					0 
			),
			'Expr_BinaryOp_NotIdentical' => array (
					8,
					0 
			),
			'Expr_BinaryOp_BitwiseAnd' => array (
					9,
					- 1 
			),
			'Expr_BinaryOp_BitwiseXor' => array (
					10,
					- 1 
			),
			'Expr_BinaryOp_BitwiseOr' => array (
					11,
					- 1 
			),
			'Expr_BinaryOp_BooleanAnd' => array (
					12,
					- 1 
			),
			'Expr_BinaryOp_BooleanOr' => array (
					13,
					- 1 
			),
			'Expr_Ternary' => array (
					14,
					- 1 
			),
			// parser uses %left for assignments, but they really behave as %right
			'Expr_Assign' => array (
					15,
					1 
			),
			'Expr_AssignRef' => array (
					15,
					1 
			),
			'Expr_AssignOp_Plus' => array (
					15,
					1 
			),
			'Expr_AssignOp_Minus' => array (
					15,
					1 
			),
			'Expr_AssignOp_Mul' => array (
					15,
					1 
			),
			'Expr_AssignOp_Div' => array (
					15,
					1 
			),
			'Expr_AssignOp_Concat' => array (
					15,
					1 
			),
			'Expr_AssignOp_Mod' => array (
					15,
					1 
			),
			'Expr_AssignOp_BitwiseAnd' => array (
					15,
					1 
			),
			'Expr_AssignOp_BitwiseOr' => array (
					15,
					1 
			),
			'Expr_AssignOp_BitwiseXor' => array (
					15,
					1 
			),
			'Expr_AssignOp_ShiftLeft' => array (
					15,
					1 
			),
			'Expr_AssignOp_ShiftRight' => array (
					15,
					1 
			),
			'Expr_AssignOp_Pow' => array (
					15,
					1 
			),
			'Expr_BinaryOp_LogicalAnd' => array (
					16,
					- 1 
			),
			'Expr_BinaryOp_LogicalXor' => array (
					17,
					- 1 
			),
			'Expr_BinaryOp_LogicalOr' => array (
					18,
					- 1 
			),
			'Expr_Include' => array (
					19,
					- 1 
			) 
	);
	protected $noIndentToken;
	protected $canUseSemicolonNamespaces;
	public function __construct() {
		$this->noIndentToken = '_NO_INDENT_' . mt_rand ();
	}
	
	/**
	 * Pretty prints an array of statements.
	 *
	 * @param Node[] $stmts
	 *        	Array of statements
	 *        	
	 * @return string Pretty printed statements
	 */
	public function prettyPrint(array $stmts) {
		$this->preprocessNodes ( $stmts );
		
		return ltrim ( str_replace ( "\n" . $this->noIndentToken, "\n", $this->pStmts ( $stmts, false ) ) );
	}
	
	/**
	 * Pretty prints an expression.
	 *
	 * @param Expr $node
	 *        	Expression node
	 *        	
	 * @return string Pretty printed node
	 */
	public function prettyPrintExpr(Expr $node) {
		return str_replace ( "\n" . $this->noIndentToken, "\n", $this->p ( $node ) );
	}
	
	/**
	 * Pretty prints a file of statements (includes the opening <?php tag if it is required).
	 *
	 * @param Node[] $stmts
	 *        	Array of statements
	 *        	
	 * @return string Pretty printed statements
	 */
	public function prettyPrintFile(array $stmts) {
		$p = rtrim ( $this->prettyPrint ( $stmts ) );
		
		$p = preg_replace ( '/^\?>\n?/', '', $p, - 1, $count );
		$p = preg_replace ( '/<\?php$/', '', $p );
		
		if (! $count) {
			$p = "<?php\n\n" . $p;
		}
		
		return $p;
	}
	
	/**
	 * Preprocesses the top-level nodes to initialize pretty printer state.
	 *
	 * @param Node[] $nodes
	 *        	Array of nodes
	 */
	protected function preprocessNodes(array $nodes) {
		/* We can use semicolon-namespaces unless there is a global namespace declaration */
		$this->canUseSemicolonNamespaces = true;
		foreach ( $nodes as $node ) {
			if ($node instanceof Stmt\Namespace_ && null === $node->name) {
				$this->canUseSemicolonNamespaces = false;
			}
		}
	}
	
	/**
	 * Pretty prints an array of nodes (statements) and indents them optionally.
	 *
	 * @param Node[] $nodes
	 *        	Array of nodes
	 * @param bool $indent
	 *        	Whether to indent the printed nodes
	 *        	
	 * @return string Pretty printed statements
	 */
	protected function pStmts(array $nodes, $indent = true) {
		$result = '';
		foreach ( $nodes as $node ) {
			$result .= "\n" . $this->pComments ( $node->getAttribute ( 'comments', array () ) ) . $this->p ( $node ) . ($node instanceof Expr ? ';' : '');
		}
		
		if ($indent) {
			return preg_replace ( '~\n(?!$|' . $this->noIndentToken . ')~', "\n    ", $result );
		} else {
			return $result;
		}
	}
	
	/**
	 * Pretty prints a node.
	 *
	 * @param Node $node
	 *        	Node to be pretty printed
	 *        	
	 * @return string Pretty printed node
	 */
	protected function p(Node $node) {
		return $this->{'p' . $node->getType ()} ( $node );
	}
	protected function pInfixOp($type, Node $leftNode, $operatorString, Node $rightNode) {
		list ( $precedence, $associativity ) = $this->precedenceMap [$type];
		
		return $this->pPrec ( $leftNode, $precedence, $associativity, - 1 ) . $operatorString . $this->pPrec ( $rightNode, $precedence, $associativity, 1 );
	}
	protected function pPrefixOp($type, $operatorString, Node $node) {
		list ( $precedence, $associativity ) = $this->precedenceMap [$type];
		return $operatorString . $this->pPrec ( $node, $precedence, $associativity, 1 );
	}
	protected function pPostfixOp($type, Node $node, $operatorString) {
		list ( $precedence, $associativity ) = $this->precedenceMap [$type];
		return $this->pPrec ( $node, $precedence, $associativity, - 1 ) . $operatorString;
	}
	
	/**
	 * Prints an expression node with the least amount of parentheses necessary to preserve the meaning.
	 *
	 * @param Node $node
	 *        	Node to pretty print
	 * @param int $parentPrecedence
	 *        	Precedence of the parent operator
	 * @param int $parentAssociativity
	 *        	Associativity of parent operator
	 *        	(-1 is left, 0 is nonassoc, 1 is right)
	 * @param int $childPosition
	 *        	Position of the node relative to the operator
	 *        	(-1 is left, 1 is right)
	 *        	
	 * @return string The pretty printed node
	 */
	protected function pPrec(Node $node, $parentPrecedence, $parentAssociativity, $childPosition) {
		$type = $node->getType ();
		if (isset ( $this->precedenceMap [$type] )) {
			$childPrecedence = $this->precedenceMap [$type] [0];
			if ($childPrecedence > $parentPrecedence || ($parentPrecedence == $childPrecedence && $parentAssociativity != $childPosition)) {
				return '(' . $this->{'p' . $type} ( $node ) . ')';
			}
		}
		
		return $this->{'p' . $type} ( $node );
	}
	
	/**
	 * Pretty prints an array of nodes and implodes the printed values.
	 *
	 * @param Node[] $nodes
	 *        	Array of Nodes to be printed
	 * @param string $glue
	 *        	Character to implode with
	 *        	
	 * @return string Imploded pretty printed nodes
	 */
	protected function pImplode(array $nodes, $glue = '') {
		$pNodes = array ();
		foreach ( $nodes as $node ) {
			$pNodes [] = $this->p ( $node );
		}
		
		return implode ( $glue, $pNodes );
	}
	
	/**
	 * Pretty prints an array of nodes and implodes the printed values with commas.
	 *
	 * @param Node[] $nodes
	 *        	Array of Nodes to be printed
	 *        	
	 * @return string Comma separated pretty printed nodes
	 */
	protected function pCommaSeparated(array $nodes) {
		return $this->pImplode ( $nodes, ', ' );
	}
	
	/**
	 * Signals the pretty printer that a string shall not be indented.
	 *
	 * @param string $string
	 *        	Not to be indented string
	 *        	
	 * @return mixed String marked with $this->noIndentToken's.
	 */
	protected function pNoIndent($string) {
		return str_replace ( "\n", "\n" . $this->noIndentToken, $string );
	}
	protected function pComments(array $comments) {
		$result = '';
		
		foreach ( $comments as $comment ) {
			$result .= $comment->getReformattedText () . "\n";
		}
		
		return $result;
	}
}