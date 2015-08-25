<?php
require_once("database.php");
require_once("prepareQueriesExecution.php");
class queryExecution{

	public function executeSelect(){		
		//error_reporting(0);
	$users= new prepareQueryExecution();
	$query=sprintf("SELECT* FROM books WHERE author_name='Charles Dickens'");
	$queryResult=$users->prepareQuery($query);
	$count=mysqli_num_rows($queryResult);
	
	while($result=mysqli_fetch_assoc($queryResult)){
		$a= $result['book_isbn']." ".$result['book_title']
		." ".$result['author_id']." ".$result['author_name']."";
		
		echo"<br/><a href='bookshop_complete/index.html'>make Purchase</a>".$a;

	}
	$query2=sprintf("SELECT* FROM books WHERE author_name='william Shakespear'");
	$queryResult2=$users->prepareQuery($query2);
	$count2=mysqli_num_rows($queryResult2);
	
	while($result2=mysqli_fetch_assoc($queryResult2)){
		$a2= $result2['book_isbn']." ".$result2['book_title']
		." ".$result2['author_id']." ".$result2['author_name']."<br/>";
		
		echo "<a href='bookshop_complete/index.html'>make Purchase</a>".$a2;

	}
	$query3=sprintf("SELECT* FROM books WHERE author_name='Ernest  Hemingway'");
	$queryResult3=$users->prepareQuery($query3);
	$count3=mysqli_num_rows($queryResult3);
	
	while($result3=mysqli_fetch_assoc($queryResult3)){
		$a3= $result3['book_isbn']." ".$result3['book_title']
		." ".$result3['author_id']." ".$result3['author_name']."<br/>";
		
		echo "<a href='bookshop_complete/index.html'>make Purchase</a>".$a3;

	}
	
 }

}
	

?>
