# CheeseBlock
Chrome Extension, for tracking where users skip within youtube videos. 



SETUP:

Database Setup:
  - Create the database table with the included 'users.sql' file within node-webapp:
  
  ```
  CREATE TABLE IF NOT EXISTS `skips` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `url` text NOT NULL,
  `from` float(5) NOT NULL,
  `to` float(5) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;
  ```
  
Node JS Setup:
- In app.js change: (To match your mysql database connection)
  
 ```
  let connection = mysql.createConnection({
              host     : 'HOST',
              user     : 'ROOT',
              password : 'PASSWORD',
              database : 'DATABASE_NAME',
              port: PORT_NO
            });
 ```
Chrome Extension Setup:
  - Simply download the CBPlugin directory, and import it onto chrome. 
  - Go to 'Manage Extensions', then 'Load Unpacked', and then choose the CBPlugin directory
  
  
  
TO RUN:

  Simply run node app.js in the terminal within the node-webapp directory.
  
  Skip within youtube videos, making sure they are being stored in your mysql databse.
