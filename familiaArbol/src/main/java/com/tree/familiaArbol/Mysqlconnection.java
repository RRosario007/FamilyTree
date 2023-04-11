package com.tree.familiaArbol;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Mysqlconnection {
	
	private static Connection con = null;
	
	static {
		String url = "jdbc:mysql:///Family";
        String user = "root";
        String pass = "password123?";
        
        try {
        	con = DriverManager.getConnection(url, user, pass);
        }catch(SQLException e) {
        	e.printStackTrace();
        }
        
        
	}
	
	public static Connection getConnection() {
		return con;
	}	

}
