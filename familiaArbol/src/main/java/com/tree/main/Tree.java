package com.tree.main;

import com.tree.familiaArbol.MysqlQuery;
/**
 * @author ricar
 *
 */
public class Tree implements UpdateTree {
	
	MysqlQuery sql = new MysqlQuery();

	public boolean addPerson(String name, int age) {
		// TODO Auto-generated method stub
		if(sql.addPerson(name, age)) {
			System.out.println("Name was added");
			return true;
		}else {
			System.err.println("Something went wrong when adding a name");
			return false;
		}
	}

	public boolean removePerson(String name) {
		// TODO Auto-generated method stub
		if(sql.removePerson(name)) {
			System.out.println("Name was deleted");
			return true;
		}else {
			System.err.println("Something went wrong when deleting a name");
			return false;
		}
	}

	public boolean addRelation(String name1, String name2) {
		// TODO Auto-generated method stub
		
		if(sql.addRelation(name1,name2)) {
			System.out.println("Relation added");
			return true;
		}else {
			System.err.println("Something went wrong when adding relation a name");
			return false;
		}
	}
	
	public boolean closeCon() {
		// TODO Auto-generated method stub
		sql.closeCon();
		return false;
	}
	
	public static void main(String[] args) {
		
		Tree family = new Tree();
		
		family.addPerson("Ashley", 21);
	}
}

