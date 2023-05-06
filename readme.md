# Electricity Bill Management System 

The main aim of developing the Electricity Bill Management System is to keep records of the customers’ bills. The admin can manage all the customers’ accounts, and the registered users like employees and customers can only manage their accounts. This system helps to maintain the bills and the payments.
In this project, different modules such as Login, User, Admin, Queries, Department, and Meters are designed considering the basic needs encountered at the time of generation, distribution, payment, payment, and payment of electricity bills.


Use Case 1: 
Generation of electricity bill for a customer.

## Primary Actor: 
Admin

## Precondition: 
	•	Admin logged in to the system.

## Main Success Scenario:

	•	Admin checks the user record
	•	Admin checks the previous billing history
	•	Admin enters the current readings to generate a bill.
	•	The system confirms the bill generation.
	•	The generated bill is saved as a record for despatch to the customer on the due date.


##### in MySQL query --> ?? is used for table names and column names ? is used for normal values like parameter value in where clause.
##### body-parser extracts the entire body portion of an incoming request stream and exposes it on req.body.