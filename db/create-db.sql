CREATE TABLE `habit` (
  `habit_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `message` varchar(500) NOT NULL,
  `phone_number` varchar(10) NOT NULL,
  `minute` varchar(45) DEFAULT NULL,
  `hour` varchar(45) DEFAULT NULL,
  `day_of_month` varchar(45) DEFAULT NULL,
  `month` varchar(45) DEFAULT NULL,
  `day_of_week` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`habit_id`)
)
