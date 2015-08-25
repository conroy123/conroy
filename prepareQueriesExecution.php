<?php
require_once("database.php");
class prepareQueryExecution{
	
	public function prepareQuery($sql, $db=null){
	$users= new databaseUser();
	$users->connectToDatabase();
		
	if(is_null($db)){
	$select=mysqli_select_db($users->connectToDatabase(),$connect['database']);	
	$result=mysqli_query($users->connectToDatabase(),$sql);
	
	return $result;	
	}else{
	mysqli_select_db($users->connectToDatabase(),$db);	
	$result=mysqli_query($users->connectToDatabase(),$sql);	
		
}
return $result;
}
}
?>
