CREATE DATABASE IF NOT EXISTS HMSapp;

USE HMSapp;

CREATE TABLE IF NOT EXISTS LoginInfo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employeeName VARCHAR(255),
  Password VARCHAR(255),
  u_id varchar(50),
  companyName varchar(100),
  age varchar(50),
  phoneNumber varchar(50),
  address varchar(100),
  role varchar(100)
);
