<?php
class databaseUser{
	public function connectToDatabase(){
		$database['hostName']="localhost";
		$database['username']="root";
		$database['password']="cnwl";
		$database['database']="shoppingCart";
	
		$connection=mysqli_connect($database['hostName'],
		$database['username'],
		$database['password'],
		$database['database']
	)or die("error connecting to database");
	
	return $connection;
}
	
}	

?>
