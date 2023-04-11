package com.tree.familiaArbol;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

public class MysqlQuery implements QueryInterface{
	
	Connection con = null;
	
	public MysqlQuery() {
		// TODO Auto-generated constructor stub
		con = Mysqlconnection.getConnection();
	}

	
	public boolean addPerson(String name, int age) {
		// TODO Auto-generated method stub
		String qry = "INSERT INTO Person (name, age) "
				+ "VALUES ('" + name + "', " + age + ");";
		String qry2 = "INSERT INTO Relation (PersonId) "
				+ "SELECT PersonId FROM Person "
				+ "WHERE Name = '" +name + "';";
		try {
			Statement stmt = con.createStatement();
			stmt.executeUpdate(qry);
			stmt.executeUpdate(qry2);			
			return true;
			
		} catch (SQLException e) {
			// TODO: handle exception
			e.printStackTrace();
			return false;
		}
	}	

	public boolean removePerson(String name) {
		// TODO Auto-generated method stub
		
		String qry = "DELETE FROM Person WHERE Name = '" + name +"';";
		String qr2 = "DELETE FROM Relation WHERE PersonId = (SELECT PersonId FROM Person "
				+ "WHERE Name = '" + name + "');";
		
		try {
			Statement stmt = con.createStatement();
			stmt.executeUpdate(qr2);
			stmt.executeUpdate(qry);
			return true;
			
		} catch (SQLException e) {
			// TODO: handle exception
			e.printStackTrace();
			return false;
		}
		
	}

	public boolean addRelation(String name1, String name2) {
		// TODO Auto-generated method stub
		String qry = "UPDATE Relation "
				+ "Set relatedId = concat_WS(', ', relatedId, (SELECT PersonId FROM Person "
				+ "WHERE Name = '"+ name2 +"')) "
						+ "Where Personid in (SELECT PersonId FROM Person "
						+ "WHERE Name = '"+ name1 +"');";
		
		try {
			Statement stmt = con.createStatement();
			stmt.executeUpdate(qry);
			return true;
			
		} catch (SQLException e) {
			// TODO: handle exception
			e.printStackTrace();
			return false;
		}
	}


	public boolean closeCon() {
		// TODO Auto-generated method stub
		try {
			con.close();
			return true;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		}
	}

	

}

