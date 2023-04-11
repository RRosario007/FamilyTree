package com.tree.main;

/**
 * @author ricardo
 *
 */
public interface UpdateTree {
	
	public boolean addPerson(String name, int age);
	public boolean removePerson(String name);
	public boolean addRelation(String name1, String name2);
	public boolean closeCon();
}
